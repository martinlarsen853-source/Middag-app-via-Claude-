// Static meal data for demo mode (GitHub Pages / no backend)
export const STORES = [
  {
    id: 1,
    name: 'Rema 1000',
    section_order: ['Frukt & grønt','Bakeri','Kjøtt & fisk','Meieri','Tørrmat','Krydder & sauser','Frys','Drikkevarer','Diverse']
  },
  {
    id: 2,
    name: 'Kiwi',
    section_order: ['Frukt & grønt','Kjøtt & fisk','Meieri','Bakeri','Tørrmat','Frys','Krydder & sauser','Drikkevarer','Diverse']
  },
  {
    id: 3,
    name: 'Coop Extra',
    section_order: ['Bakeri','Frukt & grønt','Kjøtt & fisk','Meieri','Frys','Tørrmat','Krydder & sauser','Drikkevarer','Diverse']
  }
];

export const MEALS = [
  {
    id: 1, name: 'Spaghetti Bolognese', emoji: '🍝',
    photo_url: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Klassisk italiensk kjøttsaus med spaghetti – alltid en favoritt hos hele familien.',
    time_minutes: 45, price_level: 2, category: 'Pasta',
    tags: ['Kjøtt', 'Pasta', 'Kos', 'Hverdags'],
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
    id: 2, name: 'Tacos', emoji: '🌮',
    photo_url: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Fredagstacos! Sprø taco-skjell med krydret kjøttfyll og alle tilbehørene.',
    time_minutes: 30, price_level: 2, category: 'Meksikansk',
    tags: ['Kjøtt', 'Meksikansk', 'Barn', 'Helg', 'Kos'],
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
    id: 3, name: 'Laksepasta', emoji: '🐟',
    photo_url: 'https://images.unsplash.com/photo-1559058789-672da06263d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Rask og deilig pasta med laksefilet i fløtesaus med dill.',
    time_minutes: 25, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Pasta', 'Hverdags'],
        ingredients: [
          { name: 'Pasta penne', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Laksefilet', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Matfløte', quantity: 200, unit: 'ml', section: 'Meieri' },
      { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' },
      { name: 'Frisk dill', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' },
      { name: 'Sitron', quantity: 1, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 4, name: 'Pizza Margherita', emoji: '🍕',
    photo_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Hjemmelaget pizza med sprø bunn, tomatsaus og frisk mozzarella.',
    time_minutes: 40, price_level: 1, category: 'Pizza',
    tags: ['Vegetar', 'Hverdags', 'Barn'],
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
    id: 5, name: 'Kyllingsuppe', emoji: '🍲',
    photo_url: 'https://images.unsplash.com/photo-1469307517101-0b99d8fb0c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Varm og næringsrik kyllingsuppe med rotgrønnsaker – perfekt til høst og vinter.',
    time_minutes: 50, price_level: 1, category: 'Suppe',
    tags: ['Kylling', 'Suppe', 'Langtids', 'Kos'],
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
    id: 6, name: 'Biff med potet', emoji: '🥩',
    photo_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Saftig entrecôte med hjemmelaget béarnaisesaus, ovnsstekte poteter og grønn salat.',
    time_minutes: 30, price_level: 3, category: 'Kjøtt',
    tags: ['Kjøtt', 'Helg', 'Fest'],
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
    id: 7, name: 'Omelett', emoji: '🍳',
    photo_url: 'https://images.unsplash.com/photo-1668283653825-37b80f055b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Enkel og mettende omelett med grønnsaker og ost – klar på 15 minutter.',
    time_minutes: 15, price_level: 1, category: 'Egg',
    tags: ['Vegetar', 'Enkelt', 'Barn'],
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
    id: 8, name: 'Fiskegrateng', emoji: '🐠',
    photo_url: 'https://images.unsplash.com/photo-1726455431752-fed6c661a31e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Tradisjonsrik norsk fiskegrateng med hvit saus og makaroni – hjemmelagd komfort.',
    time_minutes: 60, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Kos', 'Langtids'],
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
    id: 9, name: 'Tortellini med tomatsaus', emoji: '🫙',
    photo_url: 'https://images.unsplash.com/photo-1693609930472-cf329a4d691b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Fersk ostepasta med enkel hjemmelaget tomatsaus og frisk basilikum.',
    time_minutes: 20, price_level: 2, category: 'Pasta',
    tags: ['Vegetar', 'Pasta', 'Enkelt'],
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
    id: 10, name: 'Kyllingwok', emoji: '🥢',
    photo_url: 'https://images.unsplash.com/photo-1464500542410-1396074bf230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Rask asiatisk wok med kylling, fargerike grønnsaker og søtlig soyasaus.',
    time_minutes: 35, price_level: 2, category: 'Asiatisk',
    tags: ['Kylling', 'Asiatisk', 'Hverdags'],
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
    id: 11, name: 'Pannekaker', emoji: '🥞',
    photo_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Tynne og myke norske pannekaker med rømme og jordbærsyltetøy. Barna elsker det!',
    time_minutes: 20, price_level: 1, category: 'Enkelt',
    tags: ['Vegetar', 'Enkelt', 'Barn', 'Kos'],
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
    id: 12, name: 'Kjøttboller i saus', emoji: '🍖',
    photo_url: 'https://images.unsplash.com/photo-1565086869529-8c7802cca7a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Svenske-inspirerte kjøttboller i brun saus med potetmos og tyttebær.',
    time_minutes: 40, price_level: 2, category: 'Kjøtt',
    tags: ['Kjøtt', 'Kos', 'Barn'],
        ingredients: [
          { name: 'Kjøttdeig (blandet)', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Egg', quantity: 1, unit: 'stk', section: 'Meieri' },
      { name: 'Strøbrød', quantity: 60, unit: 'g', section: 'Bakeri' },
      { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Fløte', quantity: 100, unit: 'ml', section: 'Meieri' },
      { name: 'Brun saus (pose)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
      { name: 'Tyttebærsyltetøy', quantity: 1, unit: 'glass', section: 'Tørrmat' }
    ]
  },
  {
    id: 13, name: 'Grønnsakssuppe', emoji: '🥦',
    photo_url: 'https://images.unsplash.com/photo-1469307517101-0b99d8fb0c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Sunn og fargerik grønnsakssuppe – enkel å lage og full av smak.',
    time_minutes: 45, price_level: 1, category: 'Suppe',
    tags: ['Vegetar', 'Suppe', 'Langtids', 'Hverdags'],
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
    id: 14, name: 'Laks i ovn', emoji: '🐟',
    photo_url: 'https://images.unsplash.com/photo-1656389863625-59de2275fb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Saftig ovnsbakt laksefilet med sitronskorpe, dampet brokkoli og dillpotet.',
    time_minutes: 30, price_level: 3, category: 'Fisk',
    tags: ['Fisk', 'Helg', 'Hverdags'],
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
    id: 15, name: 'Pølse og potetstappe', emoji: '🌭',
    photo_url: 'https://images.unsplash.com/photo-1780081891218-4118de81bacc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Norsk hverdagsklassiker med grillpølser og kremete potetstappe. Raskt og trygt!',
    time_minutes: 25, price_level: 1, category: 'Enkelt',
    tags: ['Gris', 'Enkelt', 'Barn', 'Hverdags'],
        ingredients: [
          { name: 'Grillpølser', quantity: 8, unit: 'stk', section: 'Kjøtt & fisk' },
      { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Melk', quantity: 150, unit: 'ml', section: 'Meieri' },
      { name: 'Smør', quantity: 60, unit: 'g', section: 'Meieri' },
      { name: 'Gulrot', quantity: 2, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 16, name: 'Karbonader', emoji: '🥩',
    photo_url: 'https://images.unsplash.com/photo-1699236290868-8070cd393ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Norske karbonader av svinekjøtt med stekt løk, kokte poteter og brun saus.',
    time_minutes: 35, price_level: 2, category: 'Kjøtt',
    tags: ['Kjøtt', 'Gris', 'Hverdags', 'Kos'],
        ingredients: [
          { name: 'Karbonader', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Poteter', quantity: 800, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Brun saus (pose)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
      { name: 'Smør', quantity: 30, unit: 'g', section: 'Meieri' },
      { name: 'Gulrot', quantity: 2, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 17, name: 'Caesar salat', emoji: '🥗',
    photo_url: 'https://images.unsplash.com/photo-1772302541031-a3b86115ba5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Frisk og mettende Caesar-salat med sprøtt bacon, krutonger og klassisk dressing.',
    time_minutes: 20, price_level: 2, category: 'Salat',
    tags: ['Kylling', 'Salat', 'Hverdags'],
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
    id: 18, name: 'Chili con carne', emoji: '🌶️',
    photo_url: 'https://images.unsplash.com/photo-1591386767153-987783380885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Varm og krydret chili med kjøttdeig, kidneybønner og mais – server med ris.',
    time_minutes: 50, price_level: 2, category: 'Meksikansk',
    tags: ['Kjøtt', 'Meksikansk', 'Langtids', 'Helg', 'Fest'],
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
    id: 19, name: 'Lasagne', emoji: '🫙',
    photo_url: 'https://images.unsplash.com/photo-1709429790175-b02bb1b19207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Italiensk lasagne med saftig kjøttsaus, kremet bechamel og sprø ostetopp.',
    time_minutes: 70, price_level: 2, category: 'Pasta',
    tags: ['Kjøtt', 'Pasta', 'Langtids', 'Fest', 'Kos'],
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
    id: 20, name: 'Reker med brød', emoji: '🦐',
    photo_url: 'https://images.unsplash.com/photo-1581867286869-fd02aaaef2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Ferske reker servert med nystekt brød, majones og sitron – en norsk sommerklassiker.',
    time_minutes: 10, price_level: 3, category: 'Fisk',
    tags: ['Fisk', 'Enkelt', 'Fest', 'Helg'],
        ingredients: [
          { name: 'Ferske reker', quantity: 1000, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Grovbrød', quantity: 1, unit: 'stk', section: 'Bakeri' },
      { name: 'Majones', quantity: 1, unit: 'tube', section: 'Krydder & sauser' },
      { name: 'Sitron', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Smør', quantity: 50, unit: 'g', section: 'Meieri' }
    ]
  }
];

// Extract all unique ingredients from meals and assign IDs
function extractUniqueIngredients() {
  const ingredientMap = new Map();
  let id = 1;

  MEALS.forEach(meal => {
    (meal.ingredients || []).forEach(ing => {
      const key = ing.name.toLowerCase();
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          id: id++,
          name: ing.name,
          category: getCategoryFromSection(ing.section),
          price: getDefaultPrice(ing.name),
          unit: ing.unit,
          section: ing.section,
        });
      }
    });
  });

  return Array.from(ingredientMap.values());
}

function getCategoryFromSection(section) {
  const categoryMap = {
    'Frukt & grønt': 'Grønnsaker',
    'Bakeri': 'Bakeri',
    'Kjøtt & fisk': 'Kjøtt',
    'Meieri': 'Meieri',
    'Tørrmat': 'Tørrmat',
    'Krydder & sauser': 'Krydder & sauser',
    'Frys': 'Fisk',
    'Diverse': 'Diverse'
  };
  return categoryMap[section] || 'Diverse';
}

// Per-item (package) price estimate for an ingredient, in NOK.
export function ingredientPrice(ingredientName) {
  const name = (ingredientName || '').toLowerCase();
  if (/(entrecôte|entrecote|indrefilet|ytrefilet|biff|mørbrad|lam|ribbe)/.test(name)) return 180;
  if (/(laks|torsk|ørret|scampi|reker|kamskjell|fiskefilet)/.test(name)) return 120;
  if (/(kjøttdeig|karbonadedeig|kjøtt|kylling|svin|bacon|pølse|skinke|spekeskinke|coppa|karbonader|kjøttbolle|kjøttkake)/.test(name)) return 95;
  if (/(parmesan|mozzarella|fetaost|brunost)/.test(name)) return 55;
  if (/(ost|fløte|matfløte|rømme|crème|creme|kesam|yoghurt)/.test(name)) return 38;
  if (/(smør|margarin|melk|egg)/.test(name)) return 32;
  if (/(pinjekjerner|nøtter|mandler|valnøtter|peanøttsmør)/.test(name)) return 45;
  if (/(vin|rødvin|hvitvin|øl|sider|champagne)/.test(name)) return 130;
  if (/(juice|brus|saft|farris)/.test(name)) return 28;
  if (/(pizzabunn|pinsabunn|pinsa|tortilla|naan|pita|brød|loff|baguette|rundstykk|taco-skjell|tacoskjell)/.test(name)) return 30;
  if (/(pasta|spaghetti|penne|lasagne|nudler|ris|couscous|bulgur|quinoa|mel|sukker|havregryn|gryn)/.test(name)) return 25;
  if (/(olje|olivenolje|eddik|balsamico|soya|fiskesaus|ketchup|sennep|majones|pesto|salsa|tomatpuré|tomatpure|buljong|fond|honning|sirup)/.test(name)) return 35;
  if (/(hermetisk|knust tomat|passata|kokosmelk|bønner|kikerter|linser)/.test(name)) return 22;
  return 18; // vegetables, fruit, herbs, spices
}

// Sum a believable shopping-basket price for a whole meal.
export function computeMealPrice(meal) {
  const ings = meal?.ingredients || [];
  if (!ings.length) {
    const map = { 1: 100, 2: 350, 3: 900 };
    return map[meal?.price_level] || 250;
  }
  let total = 0;
  for (const ing of ings) {
    if (typeof ing.price === 'number' && ing.price > 0) { total += ing.price; continue; }
    const unitPrice = ingredientPrice(ing.ingredient_name || ing.name);
    // Count-based units multiply by quantity; weight/volume = one package.
    const u = (ing.unit || '').toLowerCase();
    const countUnits = ['stk', 'boks', 'pose', 'pakke', 'pk', 'glass', 'flaske', 'beger', 'porsjon'];
    const mult = countUnits.includes(u) ? Math.max(1, Math.round(ing.quantity || 1)) : 1;
    total += unitPrice * mult;
  }
  return Math.round(total);
}

function getDefaultPrice(ingredientName) {
  return ingredientPrice(ingredientName);
}

export const INGREDIENTS = extractUniqueIngredients();

export const INGREDIENT_CATEGORIES = [
  { id: 1, name: 'Grønnsaker', emoji: '🥬' },
  { id: 2, name: 'Kjøtt', emoji: '🍖' },
  { id: 3, name: 'Fisk', emoji: '🐟' },
  { id: 4, name: 'Meieri', emoji: '🧀' },
  { id: 5, name: 'Bakeri', emoji: '🍞' },
  { id: 6, name: 'Tørrmat', emoji: '🌾' },
  { id: 7, name: 'Krydder & sauser', emoji: '🌶️' },
  { id: 8, name: 'Diverse', emoji: '📦' }
];

// Step-by-step cooking instructions for the inspiration catalog (by meal id).
export const MEAL_INSTRUCTIONS = {
  1: [
    'Finhakk løk og hvitløk, og fres dem myke i olivenolje i en gryte.',
    'Tilsett kjøttdeigen og brun den godt til den er smuldret og gjennomstekt.',
    'Rør inn tomatpuré, og ha i de hermetiske tomatene. La sausen småkoke i minst 20 minutter.',
    'Kok spagettien al dente etter anvisning på pakken.',
    'Smak til sausen med salt og pepper, og server over spagettien med revet parmesan.',
  ],
  2: [
    'Brun kjøttdeigen i en panne til den er gjennomstekt.',
    'Tilsett tacokrydder og litt vann, og la det putre til sausen tykner.',
    'Skjær opp salat og tomat, og sett frem rømme, salsa og revet ost i skåler.',
    'Varm taco-skjellene i ovnen etter anvisning på pakken.',
    'La alle fylle sine egne skjell med kjøtt og tilbehør.',
  ],
  3: [
    'Kok pastaen al dente etter anvisning på pakken.',
    'Skjær laksefileten i terninger og finhakk hvitløken.',
    'Fres hvitløken blank i litt olje, tilsett laksen og stek til den nesten er gjennomstekt.',
    'Hell i matfløten og la det småkoke til en tykk saus.',
    'Vend inn pastaen, smak til med sitron, salt og pepper, og dryss over frisk dill.',
  ],
  4: [
    'Rør ut gjæren i lunkent vann, tilsett mel og olivenolje, og elt til en smidig deig. La den heve i minst 1 time.',
    'Kjør de hermetiske tomatene til en enkel saus og smak til med salt.',
    'Kjevle ut deigen tynt og legg den på et bakepapir.',
    'Fordel tomatsaus over bunnen og legg på revet mozzarella.',
    'Stek pizzaen på høyeste temperatur til bunnen er sprø og osten bobler.',
    'Topp med frisk basilikum før servering.',
  ],
  5: [
    'Legg hel kylling i en stor gryte, dekk med vann og kok opp. Skum av.',
    'Tilsett grovt oppkuttet gulrot, sellerirot, persillerot og løk, og la det trekke i ca. 40 minutter.',
    'Ta ut kyllingen, plukk kjøttet av beina og skjær det i biter.',
    'Sil kraften og ha grønnsakene og kyllingkjøttet tilbake i gryta.',
    'Kok opp igjen, tilsett suppenudler og la dem koke møre.',
    'Smak til med salt og pepper og dryss over frisk persille.',
  ],
  6: [
    'Kok potetene møre i lettsaltet vann.',
    'Ta biffene ut av kjøleskapet i god tid, og krydre dem med salt og pepper.',
    'Stek entrecôtene i smør et par minutter på hver side til ønsket stekegrad, og la dem hvile.',
    'Varm béarnaisesausen forsiktig.',
    'Server biffen med poteter, ruccola og cherrytomater, og sausen ved siden av.',
  ],
  7: [
    'Visp sammen egg og melk, og smak til med salt og pepper.',
    'Skjær paprika og sjampinjong i små biter.',
    'Smelt smør i en panne og stek grønnsakene et par minutter.',
    'Hell eggeblandingen over og la omeletten stivne på svak varme.',
    'Strø revet ost over, brett omeletten sammen og server.',
  ],
  8: [
    'Kok makaronien etter anvisning på pakken og legg den i en smurt ildfast form.',
    'Tin torsken, skjær den i biter og fordel over makaronien.',
    'Lag en hvit saus av smør, mel og melk, og rør inn sammenvispet egg.',
    'Hell sausen over fisken og makaronien og strø revet ost på toppen.',
    'Gratiner i ovnen på 200 °C til gratengen er gyllen.',
  ],
  9: [
    'Fres finhakket hvitløk blank i olivenolje.',
    'Tilsett de hermetiske tomatene og la sausen småkoke i 10 minutter.',
    'Kok tortellinien etter anvisning på pakken.',
    'Vend pastaen inn i tomatsausen.',
    'Smak til med salt og pepper, og server med frisk basilikum og revet parmesan.',
  ],
  10: [
    'Kok jasminrisen etter anvisning på pakken.',
    'Skjær kyllingfileten i strimler og finhakk ingefær og hvitløk.',
    'Stek kyllingen i sesamolje i en varm wok til den er gjennomstekt.',
    'Tilsett ingefær, hvitløk og wok-grønnsakene, og wok raskt til grønnsakene er sprøkokte.',
    'Smak til med soyasaus og server over risen.',
  ],
  11: [
    'Visp sammen mel, egg og melk til en glatt røre og la den svelle i 15 minutter.',
    'Smelt litt smør i en panne på middels varme.',
    'Hell i røre og stek pannekakene gylne på begge sider.',
    'Hold pannekakene varme mens du steker resten.',
    'Server med rømme og jordbærsyltetøy.',
  ],
  12: [
    'Bland kjøttdeig med egg, strøbrød, salt og pepper, og trill til boller.',
    'Brun kjøttbollene i smør i en panne.',
    'Rør ut brun saus etter anvisning på posen og tilsett litt fløte.',
    'La kjøttbollene trekke i sausen i 10 minutter.',
    'Kok potetene møre.',
    'Server med poteter, saus og tyttebærsyltetøy.',
  ],
  13: [
    'Skjær gulrot, brokkoli, blomkål, løk og poteter i biter.',
    'Fres løken blank i litt smør i en gryte.',
    'Tilsett resten av grønnsakene og dekk med grønnsaksbuljong.',
    'La suppen koke til grønnsakene er møre.',
    'Smak til med salt og pepper og dryss over frisk persille.',
  ],
  14: [
    'Sett ovnen på 200 °C og skrell potetene.',
    'Legg laksefileten i en ildfast form, krydre med salt og pepper, og legg på smørklatter og sitronskiver.',
    'Kok potetene og damp brokkolien mør.',
    'Stek laksen i ovnen i 15-20 minutter til den akkurat er gjennomstekt.',
    'Dryss over frisk dill og server med poteter og brokkoli.',
  ],
  15: [
    'Skrell og kok potetene møre.',
    'Mos potetene med melk og smør til en glatt stappe, og smak til med salt.',
    'Kok eller stek grillpølsene.',
    'Kok gulrøttene møre.',
    'Server pølsene med potetstappe og gulrot.',
  ],
  16: [
    'Form kjøttdeigen til flate karbonader.',
    'Stek karbonadene i smør til de er gjennomstekte, og stek løken myk sammen med dem.',
    'Rør ut brun saus etter anvisning på posen.',
    'Kok potetene og gulrøttene møre.',
    'Server karbonadene med løk, saus, poteter og gulrot.',
  ],
  17: [
    'Grill eller stek kyllingfileten og skjær den i strimler.',
    'Stek baconet sprøtt og smuldre det.',
    'Riv romainesalaten i biter og legg i en bolle.',
    'Vend salaten med caesar-dressing.',
    'Topp med kylling, bacon, revet parmesan og krutonger.',
  ],
  18: [
    'Finhakk løk og paprika og fres dem myke i en gryte.',
    'Tilsett kjøttdeigen og brun den godt.',
    'Rør inn chili con carne-krydder, hermetiske tomater og kidneybønner.',
    'La chilien småkoke i minst 30 minutter.',
    'Kok risen etter anvisning på pakken, og server chilien over ris.',
  ],
  19: [
    'Finhakk løk og fres den blank, tilsett kjøttdeig og brun den.',
    'Rør inn hermetiske tomater og la kjøttsausen småkoke.',
    'Lag en hvit saus av smør, mel og melk.',
    'Sett ovnen på 200 °C.',
    'Lag lag i en ildfast form med kjøttsaus, lasagneplater og hvit saus, og avslutt med revet ost.',
    'Stek lasagnen i ovnen i ca. 40 minutter til den er gyllen.',
  ],
  20: [
    'Sett frem ferske reker i et fat.',
    'Skjær grovbrød i skiver og smør på smør.',
    'Del sitronen i båter.',
    'Rør sammen en enkel rekesaus av majones og litt sitronsaft.',
    'Server rekene med brød, majones og sitron, og la alle pille selv.',
  ],
};
