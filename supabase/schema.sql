-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Stores
create table if not exists stores (
  id bigint primary key generated always as identity,
  name text not null,
  section_order jsonb not null default '[]'
);

-- Meals
create table if not exists meals (
  id bigint primary key generated always as identity,
  name text not null,
  emoji text,
  description text,
  time_minutes int,
  price_level int check (price_level between 1 and 3),
  category text,
  created_at timestamptz default now()
);

-- Meal ingredients
create table if not exists meal_ingredients (
  id bigint primary key generated always as identity,
  meal_id bigint references meals(id) on delete cascade,
  ingredient_name text not null,
  quantity real,
  unit text,
  section text
);

-- Households
create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  name text,
  invite_code text unique not null
);

-- User profiles (extends auth.users)
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  default_persons int default 2,
  household_id uuid references households(id)
);

-- Meal history (tracks when each user last ate a meal)
create table if not exists meal_history (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade,
  meal_id bigint references meals(id) on delete cascade,
  eaten_at timestamptz default now()
);

-- RLS Policies
alter table stores enable row level security;
alter table meals enable row level security;
alter table meal_ingredients enable row level security;
alter table households enable row level security;
alter table user_profiles enable row level security;
alter table meal_history enable row level security;

-- Stores and meals are public (read-only for all authenticated users)
create policy "Authenticated can read stores" on stores for select to authenticated using (true);
create policy "Authenticated can read meals" on meals for select to authenticated using (true);
create policy "Authenticated can read ingredients" on meal_ingredients for select to authenticated using (true);

-- Households: members can read their own household
create policy "Users can read own household" on households for select to authenticated using (
  id in (select household_id from user_profiles where id = auth.uid())
);
create policy "Users can insert household" on households for insert to authenticated with check (true);
create policy "Users can update own household" on households for update to authenticated using (
  id in (select household_id from user_profiles where id = auth.uid())
);

-- User profiles: users manage their own
create policy "Users can read own profile" on user_profiles for select to authenticated using (id = auth.uid());
create policy "Users can read household members" on user_profiles for select to authenticated using (
  household_id in (select household_id from user_profiles where id = auth.uid())
);
create policy "Users can insert own profile" on user_profiles for insert to authenticated with check (id = auth.uid());
create policy "Users can update own profile" on user_profiles for update to authenticated using (id = auth.uid());

-- Meal history: users manage their own
create policy "Users can read own history" on meal_history for select to authenticated using (user_id = auth.uid());
create policy "Users can insert own history" on meal_history for insert to authenticated with check (user_id = auth.uid());

-- Function: auto-create profile + household on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  new_household_id uuid;
  invite text;
begin
  invite := upper(substring(md5(random()::text), 1, 6));
  insert into households (name, invite_code) values (new.raw_user_meta_data->>'name' || 's husstand', invite)
  returning id into new_household_id;
  
  insert into user_profiles (id, name, default_persons, household_id)
  values (new.id, new.raw_user_meta_data->>'name', 2, new_household_id);
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED DATA (only inserts if meals table is empty)
-- ============================================================
DO $$ 
DECLARE
  meal_id bigint;
BEGIN
  IF (SELECT COUNT(*) FROM meals) = 0 THEN

    -- Stores
    INSERT INTO stores (name, section_order) VALUES
      ('Rema 1000', '["Frukt & grønt","Bakeri","Kjøtt & fisk","Meieri","Tørrmat","Krydder & sauser","Frys","Drikkevarer","Diverse"]'::jsonb),
      ('Kiwi',      '["Frukt & grønt","Kjøtt & fisk","Meieri","Bakeri","Tørrmat","Frys","Krydder & sauser","Drikkevarer","Diverse"]'::jsonb),
      ('Coop Extra','["Bakeri","Frukt & grønt","Kjøtt & fisk","Meieri","Frys","Tørrmat","Krydder & sauser","Drikkevarer","Diverse"]'::jsonb);

    -- 1. Spaghetti Bolognese
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Spaghetti Bolognese','🍝','Klassisk italiensk kjøttsaus med spaghetti – alltid en favoritt hos hele familien.',45,2,'Pasta')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Spaghetti',400,'g','Tørrmat'),
      (meal_id,'Kjøttdeig',600,'g','Kjøtt & fisk'),
      (meal_id,'Hermetiske tomater',2,'boks','Tørrmat'),
      (meal_id,'Løk',2,'stk','Frukt & grønt'),
      (meal_id,'Hvitløk',3,'fedd','Frukt & grønt'),
      (meal_id,'Parmesan',100,'g','Meieri'),
      (meal_id,'Tomatpuré',2,'ss','Krydder & sauser'),
      (meal_id,'Olivenolje',2,'ss','Krydder & sauser');

    -- 2. Tacos
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Tacos','🌮','Fredagstacos! Sprø taco-skjell med krydret kjøttfyll og alle tilbehørene.',30,2,'Meksikansk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Taco-skjell',12,'stk','Tørrmat'),
      (meal_id,'Kjøttdeig',500,'g','Kjøtt & fisk'),
      (meal_id,'Tacokrydder',1,'pose','Krydder & sauser'),
      (meal_id,'Rømme',200,'ml','Meieri'),
      (meal_id,'Salsa',1,'glass','Krydder & sauser'),
      (meal_id,'Revet ost',200,'g','Meieri'),
      (meal_id,'Salat',0.5,'hode','Frukt & grønt'),
      (meal_id,'Tomat',2,'stk','Frukt & grønt');

    -- 3. Laksepasta
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Laksepasta','🐟','Rask og deilig pasta med laksefilet i fløtesaus med dill.',25,2,'Fisk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Pasta penne',400,'g','Tørrmat'),
      (meal_id,'Laksefilet',500,'g','Kjøtt & fisk'),
      (meal_id,'Matfløte',200,'ml','Meieri'),
      (meal_id,'Hvitløk',2,'fedd','Frukt & grønt'),
      (meal_id,'Frisk dill',0.5,'bunt','Frukt & grønt'),
      (meal_id,'Sitronsaft',1,'stk','Frukt & grønt');

    -- 4. Pizza Margherita
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Pizza Margherita','🍕','Hjemmelaget pizza med sprø bunn, tomatsaus og frisk mozzarella.',40,1,'Pizza')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Pizzamel (tipo 00)',500,'g','Tørrmat'),
      (meal_id,'Mozzarella',250,'g','Meieri'),
      (meal_id,'Hermetiske tomater',1,'boks','Tørrmat'),
      (meal_id,'Frisk basilikum',1,'potte','Frukt & grønt'),
      (meal_id,'Gjær',1,'pakke','Bakeri'),
      (meal_id,'Olivenolje',3,'ss','Krydder & sauser');

    -- 5. Kyllingsuppe
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Kyllingsuppe','🍲','Varm og næringsrik kyllingsuppe med rotgrønnsaker – perfekt til høst og vinter.',50,1,'Suppe')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Hel kylling',1,'stk','Kjøtt & fisk'),
      (meal_id,'Gulrot',3,'stk','Frukt & grønt'),
      (meal_id,'Sellerirot',0.5,'stk','Frukt & grønt'),
      (meal_id,'Løk',1,'stk','Frukt & grønt'),
      (meal_id,'Persillerot',1,'stk','Frukt & grønt'),
      (meal_id,'Suppenudelr',200,'g','Tørrmat'),
      (meal_id,'Frisk persille',0.5,'bunt','Frukt & grønt');

    -- 6. Biff med potet
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Biff med potet','🥩','Saftig entrecôte med hjemmelaget béarnaisesaus, ovnsstekte poteter og grønn salat.',30,3,'Kjøtt')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Entrecôte',600,'g','Kjøtt & fisk'),
      (meal_id,'Poteter',800,'g','Frukt & grønt'),
      (meal_id,'Béarnaisesaus (ferdig)',1,'pakke','Krydder & sauser'),
      (meal_id,'Smør',50,'g','Meieri'),
      (meal_id,'Ruccola',1,'pose','Frukt & grønt'),
      (meal_id,'Cherrytomater',200,'g','Frukt & grønt');

    -- 7. Omelett
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Omelett','🍳','Enkel og mettende omelett med grønnsaker og ost – klar på 15 minutter.',15,1,'Egg')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Egg',8,'stk','Meieri'),
      (meal_id,'Melk',100,'ml','Meieri'),
      (meal_id,'Revet ost',150,'g','Meieri'),
      (meal_id,'Paprika',1,'stk','Frukt & grønt'),
      (meal_id,'Sjampinjong',200,'g','Frukt & grønt'),
      (meal_id,'Smør',30,'g','Meieri');

    -- 8. Fiskegrateng
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Fiskegrateng','🐠','Tradisjonsrik norsk fiskegrateng med hvit saus og makaroni – hjemmelagd komfort.',60,2,'Fisk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Torsk (frossen)',600,'g','Frys'),
      (meal_id,'Makaroni',300,'g','Tørrmat'),
      (meal_id,'Melk',500,'ml','Meieri'),
      (meal_id,'Mel',4,'ss','Tørrmat'),
      (meal_id,'Smør',60,'g','Meieri'),
      (meal_id,'Revet ost',150,'g','Meieri'),
      (meal_id,'Egg',2,'stk','Meieri');

    -- 9. Tortellini med tomatsaus
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Tortellini med tomatsaus','🫙','Fersk ostepasta med enkel hjemmelaget tomatsaus og frisk basilikum.',20,2,'Pasta')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Ostepasta (tortellini)',500,'g','Kjøtt & fisk'),
      (meal_id,'Hermetiske tomater',1,'boks','Tørrmat'),
      (meal_id,'Hvitløk',2,'fedd','Frukt & grønt'),
      (meal_id,'Frisk basilikum',1,'potte','Frukt & grønt'),
      (meal_id,'Parmesan',80,'g','Meieri'),
      (meal_id,'Olivenolje',2,'ss','Krydder & sauser');

    -- 10. Kyllingwok
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Kyllingwok','🥢','Rask asiatisk wok med kylling, fargerike grønnsaker og søtlig soyasaus.',35,2,'Asiatisk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Kyllingfilet',600,'g','Kjøtt & fisk'),
      (meal_id,'Wok-grønnsaker (blanding)',400,'g','Frukt & grønt'),
      (meal_id,'Soyasaus',4,'ss','Krydder & sauser'),
      (meal_id,'Sesamolje',2,'ts','Krydder & sauser'),
      (meal_id,'Jasminris',400,'g','Tørrmat'),
      (meal_id,'Ingefær',2,'cm','Frukt & grønt'),
      (meal_id,'Hvitløk',2,'fedd','Frukt & grønt');

    -- 11. Pannekaker
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Pannekaker','🥞','Tynne og myke norske pannekaker med rømme og jordbærsyltetøy. Barna elsker det!',20,1,'Enkelt')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Mel',300,'g','Tørrmat'),
      (meal_id,'Egg',4,'stk','Meieri'),
      (meal_id,'Melk',600,'ml','Meieri'),
      (meal_id,'Smør',50,'g','Meieri'),
      (meal_id,'Rømme',200,'ml','Meieri'),
      (meal_id,'Jordbærsyltetøy',1,'glass','Tørrmat');

    -- 12. Kjøttboller i saus
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Kjøttboller i saus','🍖','Svenske-inspirerte kjøttboller i brun saus med potetmos og tyttebær.',40,2,'Kjøtt')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Kjøttdeig (blandet)',600,'g','Kjøtt & fisk'),
      (meal_id,'Egg',1,'stk','Meieri'),
      (meal_id,'Breadcrumbs (strøbrød)',60,'g','Bakeri'),
      (meal_id,'Poteter',800,'g','Frukt & grønt'),
      (meal_id,'Fløte',100,'ml','Meieri'),
      (meal_id,'Brun saus (pose)',1,'pose','Krydder & sauser'),
      (meal_id,'Tyttebærsyltetøy',1,'glass','Tørrmat');

    -- 13. Grønnsakssuppe
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Grønnsakssuppe','🥦','Sunn og fargerik grønnsakssuppe – enkel å lage og full av smak.',45,1,'Suppe')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Gulrot',3,'stk','Frukt & grønt'),
      (meal_id,'Brokkoli',1,'hode','Frukt & grønt'),
      (meal_id,'Blomkål',0.5,'hode','Frukt & grønt'),
      (meal_id,'Løk',2,'stk','Frukt & grønt'),
      (meal_id,'Poteter',400,'g','Frukt & grønt'),
      (meal_id,'Grønnsaksbuljong',1,'terning','Krydder & sauser'),
      (meal_id,'Frisk persille',0.5,'bunt','Frukt & grønt');

    -- 14. Laks i ovn
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Laks i ovn','🐟','Saftig ovnsbakt laksefilet med sitronskorpe, dampet brokkoli og dillpotet.',30,3,'Fisk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Laksefilet',700,'g','Kjøtt & fisk'),
      (meal_id,'Sitron',1,'stk','Frukt & grønt'),
      (meal_id,'Poteter',600,'g','Frukt & grønt'),
      (meal_id,'Brokkoli',1,'hode','Frukt & grønt'),
      (meal_id,'Dill',0.5,'bunt','Frukt & grønt'),
      (meal_id,'Smør',40,'g','Meieri');

    -- 15. Pølse og potetstappe
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Pølse og potetstappe','🌭','Norsk hverdagsklassiker med grillpølser og kremete potetstappe. Raskt og trygt!',25,1,'Enkelt')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Grillpølser',8,'stk','Kjøtt & fisk'),
      (meal_id,'Poteter',800,'g','Frukt & grønt'),
      (meal_id,'Melk',150,'ml','Meieri'),
      (meal_id,'Smør',60,'g','Meieri'),
      (meal_id,'Gulrot',2,'stk','Frukt & grønt');

    -- 16. Karbonader
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Karbonader','🥩','Norske karbonader av svinekjøtt med stekt løk, kokte poteter og brun saus.',35,2,'Kjøtt')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Karbonader (ferdig/rå)',600,'g','Kjøtt & fisk'),
      (meal_id,'Løk',2,'stk','Frukt & grønt'),
      (meal_id,'Poteter',800,'g','Frukt & grønt'),
      (meal_id,'Brun saus (pose)',1,'pose','Krydder & sauser'),
      (meal_id,'Smør',30,'g','Meieri'),
      (meal_id,'Gulrot',2,'stk','Frukt & grønt');

    -- 17. Caesar salat
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Caesar salat','🥗','Frisk og mettende Caesar-salat med sprøtt bacon, krutonger og klassisk dressing.',20,2,'Salat')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Romaine salat',1,'hode','Frukt & grønt'),
      (meal_id,'Kyllingfilet (grillet)',400,'g','Kjøtt & fisk'),
      (meal_id,'Bacon',150,'g','Kjøtt & fisk'),
      (meal_id,'Caesar-dressing',1,'flaske','Krydder & sauser'),
      (meal_id,'Parmesan',80,'g','Meieri'),
      (meal_id,'Krutonger',100,'g','Bakeri');

    -- 18. Chili con carne
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Chili con carne','🌶️','Varm og krydret chili med kjøttdeig, kidneybønner og mais – server med ris.',50,2,'Meksikansk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Kjøttdeig',500,'g','Kjøtt & fisk'),
      (meal_id,'Kidneybønner',2,'boks','Tørrmat'),
      (meal_id,'Hermetiske tomater',2,'boks','Tørrmat'),
      (meal_id,'Chili con carne-krydder',1,'pose','Krydder & sauser'),
      (meal_id,'Løk',1,'stk','Frukt & grønt'),
      (meal_id,'Paprika',1,'stk','Frukt & grønt'),
      (meal_id,'Langkornet ris',400,'g','Tørrmat');

    -- 19. Lasagne
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Lasagne','🫙','Italiensk lasagne med saftig kjøttsaus, kremet bechamel og sprø ostostetopp.',70,2,'Pasta')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Lasagneplater',250,'g','Tørrmat'),
      (meal_id,'Kjøttdeig',600,'g','Kjøtt & fisk'),
      (meal_id,'Hermetiske tomater',2,'boks','Tørrmat'),
      (meal_id,'Melk',500,'ml','Meieri'),
      (meal_id,'Mel',4,'ss','Tørrmat'),
      (meal_id,'Smør',60,'g','Meieri'),
      (meal_id,'Revet ost',200,'g','Meieri'),
      (meal_id,'Løk',1,'stk','Frukt & grønt');

    -- 20. Reker med brød
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES ('Reker med brød','🦐','Ferske reker servert med nystekt brød, majones og sitron – en norsk sommerklassiker.',10,3,'Fisk')
    RETURNING id INTO meal_id;
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section) VALUES
      (meal_id,'Ferske reker',1000,'g','Kjøtt & fisk'),
      (meal_id,'Grovbrød',1,'stk','Bakeri'),
      (meal_id,'Majones',1,'tube','Krydder & sauser'),
      (meal_id,'Sitron',1,'stk','Frukt & grønt'),
      (meal_id,'Smør',50,'g','Meieri');

  END IF;
END $$;
