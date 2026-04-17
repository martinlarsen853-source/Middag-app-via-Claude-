-- Gjør handle_new_user-triggeren robust mot manglende metadata
-- (hindrer 500 Internal Server Error på signup)

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  new_household_id uuid;
  invite text;
  user_name text;
  user_persons int;
begin
  -- Fallback til e-post-prefiks hvis navn mangler
  user_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    split_part(new.email, '@', 1)
  );

  user_persons := coalesce((new.raw_user_meta_data->>'default_persons')::int, 2);

  -- Generer unik invitasjonskode (prøv opptil 5 ganger)
  for i in 1..5 loop
    invite := upper(substring(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from households where invite_code = invite);
  end loop;

  insert into households (name, invite_code)
  values (user_name || 's husstand', invite)
  returning id into new_household_id;

  insert into user_profiles (id, name, default_persons, household_id)
  values (new.id, user_name, user_persons, new_household_id);

  return new;
exception when others then
  -- Logg feilen men ikke blokker brukerregistrering
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
