const db = require('./db');

function seed() {
  const mealCount = db.prepare('SELECT COUNT(*) as count FROM meals').get();
  if (mealCount.count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  // Insert stores with section ordering
  const insertStore = db.prepare('INSERT INTO stores (name, section_order) VALUES (?, ?)');

  const rema1000Sections = JSON.stringify([
    'Frukt & grønt',
    'Bakeri',
    'Kjøtt & fisk',
    'Meieri',
    'Tørrmat',
    'Krydder & sauser',
    'Frys',
    'Drikkevarer',
    'Diverse'
  ]);

  const kiwiSections = JSON.stringify([
    'Frukt & grønt',
    'Kjøtt & fisk',
    'Meieri',
    'Bakeri',
    'Tørrmat',
    'Frys',
    'Krydder & sauser',
    'Drikkevarer',
    'Diverse'
  ]);

  const coopSections = JSON.stringify([
    'Bakeri',
    'Frukt & grønt',
    'Kjøtt & fisk',
    'Meieri',
    'Frys',
    'Tørrmat',
    'Krydder & sauser',
    'Drikkevarer',
    'Diverse'
  ]);

  insertStore.run('Rema 1000', rema1000Sections);
  insertStore.run('Kiwi', kiwiSections);
  insertStore.run('Coop Extra', coopSections);

  // Insert meals with ingredients
  const insertMeal = db.prepare(`
    INSERT INTO meals (name, emoji, description, time_minutes, price_level, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertIngredient = db.prepare(`
    INSERT INTO meal_ingredients (meal_id, ingredient_name, quantity, unit, section)
    VALUES (?, ?, ?, ?, ?)
  `);

  const meals = [
    {
      name: 'Spaghetti Bolognese',
      emoji: '🍝',
      description: 'Klassisk italiensk kjøttsaus med spaghetti – alltid en favoritt hos hele familien.',
      time_minutes: 45,
      price_level: 2,
      category: 'Pasta',
      ingredients: [
        { name: 'Spaghetti', quantity: 400, unit: 'g', section: 'Tørrmat' },
        { name: 'Kjøttdeig', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Hermetiske tomater', quantity: 2, unit: 'boks', section: 'Tørrmat' },
        { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Hvitløk', quantity: 3, unit: 'fedd', section: 'Frukt & grønt' },
        { name: 'Parmesan', quantity: 100, unit: 'g', section: 'Meieri' },
        { name: 'Tomatpuré', quantity: 2, unit: 'ss', section: 'Krydder & sauser' },
        { name: 'Olivenolje', quantity: 2, unit: 'ss', section: 'Krydder & sauser' }
      ]
    },
    {
      name: 'Tacos',
      emoji: '🌮',
      description: 'Fredagstacos! Sprø taco-skjell med krydret kjøttfyll og alle tilbehørene.',
      time_minutes: 30,
      price_level: 2,
      category: 'Meksikansk',
      ingredients: [
        { name: 'Taco-skjell', quantity: 12, unit: 'stk', section: 'Tørrmat' },
        { name: 'Kjøttdeig', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Tacokrydder', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
        { name: 'Rømme', quantity: 200, unit: 'ml', section: 'Meieri' },
        { name: 'Salsa', quantity: 1, unit: 'glass', section: 'Krydder & sauser' },
        { name: 'Revet ost', quantity: 200, unit: 'g', section: 'Meieri' },
        { name: 'Salat', quantity: 0.5, unit: 'hode', section: 'Frukt & grønt' },
        { name: 'Tomat', quantity: 2, unit: 'stk', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Laksepasta',
      emoji: '🐟',
      description: 'Rask og deilig pasta med laksefilet i fløtesaus med dill.',
      time_minutes: 25,
      price_level: 2,
      category: 'Fisk',
      ingredients: [
        { name: 'Pasta penne', quantity: 400, unit: 'g', section: 'Tørrmat' },
        { name: 'Laksefilet', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Matfløte', quantity: 200, unit: 'ml', section: 'Meieri' },
        { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' },
        { name: 'Frisk dill', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' },
        { name: 'Sitronsaft', quantity: 1, unit: 'stk', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Pizza Margherita',
      emoji: '🍕',
      description: 'Hjemmelaget pizza med sprø bunn, tomatsaus og frisk mozzarella.',
      time_minutes: 40,
      price_level: 1,
      category: 'Pizza',
      ingredients: [
        { name: 'Pizzamel (tipo 00)', quantity: 500, unit: 'g', section: 'Tørrmat' },
        { name: 'Mozzarella', quantity: 250, unit: 'g', section: 'Meieri' },
        { name: 'Hermetiske tomater', quantity: 1, unit: 'boks', section: 'Tørrmat' },
        { name: 'Frisk basilikum', quantity: 1, unit: 'potte', section: 'Frukt & grønt' },
        { name: 'Gjær', quantity: 1, unit: 'pakke', section: 'Bakeri' },
        { name: 'Olivenolje', quantity: 3, unit: 'ss', section: 'Krydder & sauser' }
      ]
    },
    {
      name: 'Kyllingsuppe',
      emoji: '🍲',
      description: 'Varm og næringsrik kyllingsuppe med rotgrønnsaker – perfekt til høst og vinter.',
      time_minutes: 50,
      price_level: 1,
      category: 'Suppe',
      ingredients: [
        { name: 'Hel kylling', quantity: 1, unit: 'stk', section: 'Kjøtt & fisk' },
        { name: 'Gulrot', quantity: 3, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Sellerirot', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Løk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Persillerot', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Suppenudelr', quantity: 200, unit: 'g', section: 'Tørrmat' },
        { name: 'Frisk persille', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Biff med potet',
      emoji: '🥩',
      description: 'Saftig entrecôte med hjemmelaget béarnaisesaus, ovnsstekte poteter og grønn salat.',
      time_minutes: 30,
      price_level: 3,
      category: 'Kjøtt',
      ingredients: [
        { name: 'Entrecôte', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Béarnaisesaus (ferdig)', quantity: 1, unit: 'pakke', section: 'Krydder & sauser' },
        { name: 'Smør', quantity: 50, unit: 'g', section: 'Meieri' },
        { name: 'Ruccola', quantity: 1, unit: 'pose', section: 'Frukt & grønt' },
        { name: 'Cherrytomater', quantity: 200, unit: 'g', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Omelett',
      emoji: '🍳',
      description: 'Enkel og mettende omelett med grønnsaker og ost – klar på 15 minutter.',
      time_minutes: 15,
      price_level: 1,
      category: 'Egg',
      ingredients: [
        { name: 'Egg', quantity: 8, unit: 'stk', section: 'Meieri' },
        { name: 'Melk', quantity: 100, unit: 'ml', section: 'Meieri' },
        { name: 'Revet ost', quantity: 150, unit: 'g', section: 'Meieri' },
        { name: 'Paprika', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Sjampinjong', quantity: 200, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Smør', quantity: 30, unit: 'g', section: 'Meieri' }
      ]
    },
    {
      name: 'Fiskegrateng',
      emoji: '🐠',
      description: 'Tradisjonsrik norsk fiskegrateng med hvit saus og makaroni – hjemmelagd komfort.',
      time_minutes: 60,
      price_level: 2,
      category: 'Fisk',
      ingredients: [
        { name: 'Torsk (frossen)', quantity: 600, unit: 'g', section: 'Frys' },
        { name: 'Makaroni', quantity: 300, unit: 'g', section: 'Tørrmat' },
        { name: 'Melk', quantity: 500, unit: 'ml', section: 'Meieri' },
        { name: 'Mel', quantity: 4, unit: 'ss', section: 'Tørrmat' },
        { name: 'Smør', quantity: 60, unit: 'g', section: 'Meieri' },
        { name: 'Revet ost', quantity: 150, unit: 'g', section: 'Meieri' },
        { name: 'Egg', quantity: 2, unit: 'stk', section: 'Meieri' }
      ]
    },
    {
      name: 'Tortellini med tomatsaus',
      emoji: '🫙',
      description: 'Fersk ostepasta med enkel hjemmelaget tomatsaus og frisk basilikum.',
      time_minutes: 20,
      price_level: 2,
      category: 'Pasta',
      ingredients: [
        { name: 'Ostepasta (tortellini)', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Hermetiske tomater', quantity: 1, unit: 'boks', section: 'Tørrmat' },
        { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' },
        { name: 'Frisk basilikum', quantity: 1, unit: 'potte', section: 'Frukt & grønt' },
        { name: 'Parmesan', quantity: 80, unit: 'g', section: 'Meieri' },
        { name: 'Olivenolje', quantity: 2, unit: 'ss', section: 'Krydder & sauser' }
      ]
    },
    {
      name: 'Kyllingwok',
      emoji: '🥢',
      description: 'Rask asiatisk wok med kylling, fargerike grønnsaker og søtlig soyasaus.',
      time_minutes: 35,
      price_level: 2,
      category: 'Asiatisk',
      ingredients: [
        { name: 'Kyllingfilet', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Wok-grønnsaker (blanding)', quantity: 400, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Soyasaus', quantity: 4, unit: 'ss', section: 'Krydder & sauser' },
        { name: 'Sesamolje', quantity: 2, unit: 'ts', section: 'Krydder & sauser' },
        { name: 'Jasminris', quantity: 400, unit: 'g', section: 'Tørrmat' },
        { name: 'Ingefær', quantity: 2, unit: 'cm', section: 'Frukt & grønt' },
        { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Pannekaker',
      emoji: '🥞',
      description: 'Tynne og myke norske pannekaker med rømme og jordbærsyltetøy. Barna elsker det!',
      time_minutes: 20,
      price_level: 1,
      category: 'Enkelt',
      ingredients: [
        { name: 'Mel', quantity: 300, unit: 'g', section: 'Tørrmat' },
        { name: 'Egg', quantity: 4, unit: 'stk', section: 'Meieri' },
        { name: 'Melk', quantity: 600, unit: 'ml', section: 'Meieri' },
        { name: 'Smør', quantity: 50, unit: 'g', section: 'Meieri' },
        { name: 'Rømme', quantity: 200, unit: 'ml', section: 'Meieri' },
        { name: 'Jordbærsyltetøy', quantity: 1, unit: 'glass', section: 'Tørrmat' }
      ]
    },
    {
      name: 'Kjøttboller i saus',
      emoji: '🍖',
      description: 'Svenske-inspirerte kjøttboller i brun saus med potetmos og tyttebær.',
      time_minutes: 40,
      price_level: 2,
      category: 'Kjøtt',
      ingredients: [
        { name: 'Kjøttdeig (blandet)', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Egg', quantity: 1, unit: 'stk', section: 'Meieri' },
        { name: 'Breadcrumbs (strøbrød)', quantity: 60, unit: 'g', section: 'Bakeri' },
        { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Fløte', quantity: 100, unit: 'ml', section: 'Meieri' },
        { name: 'Brun saus (pose)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
        { name: 'Tyttebærsyltetøy', quantity: 1, unit: 'glass', section: 'Tørrmat' }
      ]
    },
    {
      name: 'Grønnsakssuppe',
      emoji: '🥦',
      description: 'Sunn og fargerik grønnsakssuppe – enkel å lage og full av smak.',
      time_minutes: 45,
      price_level: 1,
      category: 'Suppe',
      ingredients: [
        { name: 'Gulrot', quantity: 3, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Brokkoli', quantity: 1, unit: 'hode', section: 'Frukt & grønt' },
        { name: 'Blomkål', quantity: 0.5, unit: 'hode', section: 'Frukt & grønt' },
        { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Poteter', quantity: 400, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Grønnsaksbuljong', quantity: 1, unit: 'terning', section: 'Krydder & sauser' },
        { name: 'Frisk persille', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Laks i ovn',
      emoji: '🐟',
      description: 'Saftig ovnsbakt laksefilet med sitronskorpe, dampet brokkoli og dillpotet.',
      time_minutes: 30,
      price_level: 3,
      category: 'Fisk',
      ingredients: [
        { name: 'Laksefilet', quantity: 700, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Sitron', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Poteter', quantity: 600, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Brokkoli', quantity: 1, unit: 'hode', section: 'Frukt & grønt' },
        { name: 'Dill', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' },
        { name: 'Smør', quantity: 40, unit: 'g', section: 'Meieri' }
      ]
    },
    {
      name: 'Pølse og potetstappe',
      emoji: '🌭',
      description: 'Norsk hverdagsklassiker med grillpølser og kremete potetstappe. Raskt og trygt!',
      time_minutes: 25,
      price_level: 1,
      category: 'Enkelt',
      ingredients: [
        { name: 'Grillpølser', quantity: 8, unit: 'stk', section: 'Kjøtt & fisk' },
        { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Melk', quantity: 150, unit: 'ml', section: 'Meieri' },
        { name: 'Smør', quantity: 60, unit: 'g', section: 'Meieri' },
        { name: 'Gulrot', quantity: 2, unit: 'stk', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Karbonader',
      emoji: '🥩',
      description: 'Norske karbonader av svinekjøtt med stekt løk, kokte poteter og brun saus.',
      time_minutes: 35,
      price_level: 2,
      category: 'Kjøtt',
      ingredients: [
        { name: 'Karbonader (ferdig/rå)', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
        { name: 'Brun saus (pose)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
        { name: 'Smør', quantity: 30, unit: 'g', section: 'Meieri' },
        { name: 'Gulrot', quantity: 2, unit: 'stk', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Caesar salat',
      emoji: '🥗',
      description: 'Frisk og mettende Caesar-salat med sprøtt bacon, krutonger og klassisk dressing.',
      time_minutes: 20,
      price_level: 2,
      category: 'Salat',
      ingredients: [
        { name: 'Romaine salat', quantity: 1, unit: 'hode', section: 'Frukt & grønt' },
        { name: 'Kyllingfilet (grillet)', quantity: 400, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Bacon', quantity: 150, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Caesar-dressing', quantity: 1, unit: 'flaske', section: 'Krydder & sauser' },
        { name: 'Parmesan', quantity: 80, unit: 'g', section: 'Meieri' },
        { name: 'Krutonger', quantity: 100, unit: 'g', section: 'Bakeri' }
      ]
    },
    {
      name: 'Chili con carne',
      emoji: '🌶️',
      description: 'Varm og krydret chili med kjøttdeig, kidneybønner og mais – server med ris.',
      time_minutes: 50,
      price_level: 2,
      category: 'Meksikansk',
      ingredients: [
        { name: 'Kjøttdeig', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Kidneybønner', quantity: 2, unit: 'boks', section: 'Tørrmat' },
        { name: 'Hermetiske tomater', quantity: 2, unit: 'boks', section: 'Tørrmat' },
        { name: 'Chili con carne-krydder', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
        { name: 'Løk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Paprika', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Langkornet ris', quantity: 400, unit: 'g', section: 'Tørrmat' }
      ]
    },
    {
      name: 'Lasagne',
      emoji: '🫙',
      description: 'Italiensk lasagne med saftig kjøttsaus, kremet bechamel og sprø ostostetopp.',
      time_minutes: 70,
      price_level: 2,
      category: 'Pasta',
      ingredients: [
        { name: 'Lasagneplater', quantity: 250, unit: 'g', section: 'Tørrmat' },
        { name: 'Kjøttdeig', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Hermetiske tomater', quantity: 2, unit: 'boks', section: 'Tørrmat' },
        { name: 'Melk', quantity: 500, unit: 'ml', section: 'Meieri' },
        { name: 'Mel', quantity: 4, unit: 'ss', section: 'Tørrmat' },
        { name: 'Smør', quantity: 60, unit: 'g', section: 'Meieri' },
        { name: 'Revet ost', quantity: 200, unit: 'g', section: 'Meieri' },
        { name: 'Løk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' }
      ]
    },
    {
      name: 'Reker med brød',
      emoji: '🦐',
      description: 'Ferske reker servert med nystekt brød, majones og sitron – en norsk sommerklassiker.',
      time_minutes: 10,
      price_level: 3,
      category: 'Fisk',
      ingredients: [
        { name: 'Ferske reker', quantity: 1000, unit: 'g', section: 'Kjøtt & fisk' },
        { name: 'Grovbrød', quantity: 1, unit: 'stk', section: 'Bakeri' },
        { name: 'Majones', quantity: 1, unit: 'tube', section: 'Krydder & sauser' },
        { name: 'Sitron', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
        { name: 'Smør', quantity: 50, unit: 'g', section: 'Meieri' }
      ]
    }
  ];

  const seedTransaction = db.transaction(() => {
    for (const meal of meals) {
      const result = insertMeal.run(
        meal.name,
        meal.emoji,
        meal.description,
        meal.time_minutes,
        meal.price_level,
        meal.category
      );
      const mealId = result.lastInsertRowid;

      for (const ing of meal.ingredients) {
        insertIngredient.run(mealId, ing.name, ing.quantity, ing.unit, ing.section);
      }
    }
  });

  seedTransaction();
  console.log(`Seeded ${meals.length} meals and 3 stores.`);
}

module.exports = seed;
