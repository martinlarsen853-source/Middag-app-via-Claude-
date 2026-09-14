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
  },
  {
    id: 21, name: 'Fiskesuppe', emoji: '🍲',
    description: 'Kremet fiskesuppe med gulrot, purre og potet – varmende og mettende hverdagsmat.',
    time_minutes: 40, price_level: 2, category: 'Suppe',
    tags: ['Fisk', 'Suppe', 'Kos', 'Langtids'],
    ingredients: [
      { name: 'Torskefilet', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Laksefilet', quantity: 200, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Fiskekraft (terning)', quantity: 2, unit: 'terning', section: 'Krydder & sauser' },
      { name: 'Purre', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Gulrot', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Poteter', quantity: 300, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Matfløte', quantity: 300, unit: 'ml', section: 'Meieri' },
      { name: 'Frisk dill', quantity: 0.5, unit: 'bunt', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 22, name: 'Pasta carbonara', emoji: '🍝',
    description: 'Ekte italiensk pasta carbonara med sprøstekt bacon, egg og parmesan – rask og god.',
    time_minutes: 20, price_level: 2, category: 'Pasta',
    tags: ['Gris', 'Pasta', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Bacon', quantity: 200, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Egg', quantity: 4, unit: 'stk', section: 'Meieri' },
      { name: 'Parmesan', quantity: 100, unit: 'g', section: 'Meieri' },
      { name: 'Hvitløk', quantity: 1, unit: 'fedd', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 23, name: 'Kylling tikka masala', emoji: '🍛',
    description: 'Krydret kyllinggryte i kremet tomatsaus, servert med ris – indisk favoritt på norske middagsbord.',
    time_minutes: 45, price_level: 2, category: 'Asiatisk',
    tags: ['Kylling', 'Asiatisk', 'Kos'],
    ingredients: [
      { name: 'Kyllingfilet', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Tikka masala-saus (ferdig)', quantity: 1, unit: 'boks', section: 'Krydder & sauser' },
      { name: 'Hermetiske tomater', quantity: 1, unit: 'boks', section: 'Tørrmat' },
      { name: 'Kokosmelk', quantity: 1, unit: 'boks', section: 'Tørrmat' },
      { name: 'Løk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' },
      { name: 'Ingefær', quantity: 2, unit: 'cm', section: 'Frukt & grønt' },
      { name: 'Jasminris', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Naanbrød', quantity: 4, unit: 'stk', section: 'Bakeri' }
    ]
  },
  {
    id: 24, name: 'Lammegryte', emoji: '🍖',
    description: 'Langtidskokt lammegryte med rotgrønnsaker og rosmarin – mør og fyldig søndagsmat.',
    time_minutes: 100, price_level: 3, category: 'Kjøtt',
    tags: ['Kjøtt', 'Langtids', 'Helg', 'Kos'],
    ingredients: [
      { name: 'Lammebog i terninger', quantity: 800, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Poteter', quantity: 600, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Gulrot', quantity: 3, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Kålrot', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Kjøttbuljong (terning)', quantity: 2, unit: 'terning', section: 'Krydder & sauser' },
      { name: 'Frisk rosmarin', quantity: 1, unit: 'kvast', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 25, name: 'Bacalao', emoji: '🐟',
    description: 'Norsk-portugisisk klassiker med klippfisk, tomater, poteter og oliven.',
    time_minutes: 55, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Langtids', 'Helg'],
    ingredients: [
      { name: 'Utvannet klippfisk', quantity: 800, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Poteter', quantity: 600, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Løk', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Hermetiske tomater', quantity: 2, unit: 'boks', section: 'Tørrmat' },
      { name: 'Paprika', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Sorte oliven', quantity: 100, unit: 'g', section: 'Krydder & sauser' },
      { name: 'Olivenolje', quantity: 4, unit: 'ss', section: 'Krydder & sauser' },
      { name: 'Hvitløk', quantity: 3, unit: 'fedd', section: 'Frukt & grønt' },
      { name: 'Chili', quantity: 1, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  // ── Oda-oppskrifter (hentet fra oda.com/no/recipes) ──────────────────────
  {
    id: 26, name: 'Rask kremet kyllingpanne med parmesan og pasta', emoji: '🍝',
    description: 'Rask kremet kyllingpanne med parmesan, babyspinat og pasta – ferdig på 20 minutter.',
    time_minutes: 20, price_level: 2, category: 'Pasta',
    tags: ['Kylling', 'Pasta', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Tagliatelle (fersk)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Kyllingfilet', quantity: 400, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Parmesan (revet)', quantity: 80, unit: 'g', section: 'Meieri' },
      { name: 'Babyspinat', quantity: 100, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Fløte', quantity: 300, unit: 'ml', section: 'Meieri' },
      { name: 'Paprikapulver', quantity: 2, unit: 'ts', section: 'Krydder & sauser' }
    ]
  },
  {
    id: 27, name: 'Laks med basilikum og kremet brokkolipasta', emoji: '🐟',
    description: 'Stekt laks med frisk basilikum og lime, servert over kremet brokkolipasta.',
    time_minutes: 20, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Pasta', 'Hverdags'],
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Brokkoli', quantity: 200, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Crème fraîche', quantity: 2, unit: 'dl', section: 'Meieri' },
      { name: 'Parmesan (revet)', quantity: 50, unit: 'g', section: 'Meieri' },
      { name: 'Frisk basilikum', quantity: 20, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Lime', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Laksefilet', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' }
    ]
  },
  {
    id: 28, name: 'Sommerfuglpasta med erter og parmesan', emoji: '🍝',
    description: 'Sommerfuglpasta med kremet ertepuré, parmesan og sprøstekt spekesalami.',
    time_minutes: 20, price_level: 2, category: 'Pasta',
    tags: ['Gris', 'Pasta', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Sommerfuglpasta (farfalle)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Frosne erter', quantity: 300, unit: 'g', section: 'Frys' },
      { name: 'Kyllingbuljong', quantity: 0.5, unit: 'dl', section: 'Krydder & sauser' },
      { name: 'Smør', quantity: 1, unit: 'ts', section: 'Meieri' },
      { name: 'Parmesan (revet)', quantity: 80, unit: 'g', section: 'Meieri' },
      { name: 'Spekesalami', quantity: 130, unit: 'g', section: 'Kjøtt & fisk' }
    ]
  },
  {
    id: 29, name: 'Rask soppcarbonara', emoji: '🍝',
    description: 'Vegetarisk carbonara med ovnsstekt sopp i stedet for bacon – kremet og rask.',
    time_minutes: 20, price_level: 2, category: 'Pasta',
    tags: ['Vegetar', 'Pasta', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Tagliatelle (fersk)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Sjampinjong', quantity: 400, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Egg', quantity: 2, unit: 'stk', section: 'Meieri' },
      { name: 'Parmesan (revet)', quantity: 150, unit: 'g', section: 'Meieri' },
      { name: 'Frisk bladpersille', quantity: 1, unit: 'håndfull', section: 'Frukt & grønt' },
      { name: 'Olivenolje', quantity: 2, unit: 'ss', section: 'Krydder & sauser' }
    ]
  },
  {
    id: 30, name: 'Blomkålsuppe med krydderstekte kikerter', emoji: '🍲',
    description: 'Kremet blomkålsuppe toppet med sprøstekte, krydrede kikerter.',
    time_minutes: 25, price_level: 1, category: 'Suppe',
    tags: ['Vegetar', 'Suppe', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Blomkål', quantity: 1, unit: 'hode', section: 'Frukt & grønt' },
      { name: 'Helmelk', quantity: 6, unit: 'dl', section: 'Meieri' },
      { name: 'Grønnsaksbuljong', quantity: 1, unit: 'ss', section: 'Krydder & sauser' },
      { name: 'Muskatnøtt (malt)', quantity: 0.5, unit: 'ts', section: 'Krydder & sauser' },
      { name: 'Crème fraîche', quantity: 2, unit: 'dl', section: 'Meieri' },
      { name: 'Kikerter (hermetiske)', quantity: 410, unit: 'g', section: 'Tørrmat' },
      { name: 'Tacokrydder', quantity: 1, unit: 'ts', section: 'Krydder & sauser' },
      { name: 'Frisk persille', quantity: 10, unit: 'g', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 31, name: 'Rask thai nudelsalat', emoji: '🍜',
    description: 'Frisk og rask thai-inspirert nudelsalat med eple, ingefær og peanøtter.',
    time_minutes: 20, price_level: 2, category: 'Asiatisk',
    tags: ['Vegetar', 'Asiatisk', 'Salat', 'Hverdags'],
    ingredients: [
      { name: 'Eggnudler', quantity: 250, unit: 'g', section: 'Tørrmat' },
      { name: 'Grønnsaksblanding (rå)', quantity: 225, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Grønt eple', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Frisk ingefær', quantity: 2, unit: 'ss', section: 'Frukt & grønt' },
      { name: 'Lime', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Ketjap manis', quantity: 1, unit: 'dl', section: 'Krydder & sauser' },
      { name: 'Harissa (eller tabasco)', quantity: 1, unit: 'ts', section: 'Krydder & sauser' },
      { name: 'Frisk koriander', quantity: 20, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Sprøstekt løk', quantity: 4, unit: 'ss', section: 'Krydder & sauser' },
      { name: 'Saltede peanøtter', quantity: 50, unit: 'g', section: 'Tørrmat' }
    ]
  },
  {
    id: 32, name: 'Falafelwrap med avokadohummus', emoji: '🌯',
    description: 'Fargerike falafelwraps med kremet avokadohummus og friske grønnsaker.',
    time_minutes: 20, price_level: 3, category: 'Annet',
    tags: ['Vegetar', 'Barn', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Ferdig falafel', quantity: 600, unit: 'g', section: 'Frys' },
      { name: 'Tortillalefser', quantity: 8, unit: 'stk', section: 'Bakeri' },
      { name: 'Avokado', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Tahini', quantity: 1, unit: 'ts', section: 'Krydder & sauser' },
      { name: 'Kikerter (hermetiske)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Hvitløk', quantity: 2, unit: 'fedd', section: 'Frukt & grønt' },
      { name: 'Sitron', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Olivenolje', quantity: 0.5, unit: 'dl', section: 'Krydder & sauser' },
      { name: 'Ruccola', quantity: 70, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Agurk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Tomat', quantity: 2, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Rødløk', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 33, name: 'Rask kremet kokoscurry med laks', emoji: '🍛',
    description: 'Kremet kokoscurry med stekt laks, rød karripasta og frisk basilikum.',
    time_minutes: 20, price_level: 2, category: 'Asiatisk',
    tags: ['Fisk', 'Asiatisk', 'Hverdags'],
    ingredients: [
      { name: 'Basmatiris', quantity: 250, unit: 'g', section: 'Tørrmat' },
      { name: 'Laksefilet (uten skinn)', quantity: 500, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Kokosmelk', quantity: 400, unit: 'ml', section: 'Tørrmat' },
      { name: 'Rød karripasta', quantity: 2, unit: 'ss', section: 'Krydder & sauser' },
      { name: 'Frisk basilikum', quantity: 1, unit: 'håndfull', section: 'Frukt & grønt' },
      { name: 'Sitron', quantity: 0.25, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 34, name: 'Sprø lakseburger med grønnsaksslaw', emoji: '🍔',
    description: 'Sprøstekte lakseburgere i brød med frisk grønnsaksslaw.',
    time_minutes: 20, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Rødkål', quantity: 150, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Sylteagurk', quantity: 50, unit: 'g', section: 'Krydder & sauser' },
      { name: 'Crème fraîche', quantity: 5, unit: 'ss', section: 'Meieri' },
      { name: 'Grønnsaksblanding (rå)', quantity: 225, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Lakseburgere (rå)', quantity: 4, unit: 'stk', section: 'Kjøtt & fisk' },
      { name: 'Semulegryn', quantity: 4, unit: 'ss', section: 'Tørrmat' },
      { name: 'Ruccola', quantity: 70, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Hamburgerbrød', quantity: 4, unit: 'stk', section: 'Bakeri' }
    ]
  },
  {
    id: 35, name: 'Fiskepinner i wraps', emoji: '🌯',
    description: 'Sprø fiskepinner i wraps med sukkererter, cherrytomater og hjemmelaget dillrømme.',
    time_minutes: 20, price_level: 2, category: 'Fisk',
    tags: ['Fisk', 'Barn', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Romanosalat', quantity: 1, unit: 'hode', section: 'Frukt & grønt' },
      { name: 'Fiskepinner (frosne)', quantity: 600, unit: 'g', section: 'Frys' },
      { name: 'Tortillalefser', quantity: 8, unit: 'stk', section: 'Bakeri' },
      { name: 'Agurk', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Sukkererter', quantity: 150, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Cherrytomater', quantity: 200, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Rømme', quantity: 3, unit: 'dl', section: 'Meieri' },
      { name: 'Frisk dill', quantity: 20, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Sukker', quantity: 1, unit: 'ts', section: 'Tørrmat' },
      { name: 'Sitron', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 36, name: 'Raske kyllinglår med potetmos, peppersaus og brokkoli', emoji: '🍗',
    description: 'Ovnsstekte kyllinglår med kremet potetmos, peppersaus og dampet brokkoli.',
    time_minutes: 20, price_level: 2, category: 'Kjøtt',
    tags: ['Kylling', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Potetmos (fersk)', quantity: 500, unit: 'g', section: 'Meieri' },
      { name: 'Kyllinglår', quantity: 850, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Peppersaus (ferdig)', quantity: 250, unit: 'ml', section: 'Krydder & sauser' },
      { name: 'Brokkoli', quantity: 200, unit: 'g', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 37, name: 'Rask tikka masala med kylling', emoji: '🍛',
    description: 'Rask og kremet tikka masala med kylling, servert med ris og frisk koriander.',
    time_minutes: 20, price_level: 2, category: 'Asiatisk',
    tags: ['Kylling', 'Asiatisk', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Ris (porsjonspose)', quantity: 2, unit: 'stk', section: 'Tørrmat' },
      { name: 'Kyllingfilet', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Tikka masala-saus (ferdig)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
      { name: 'Crème fraîche', quantity: 2, unit: 'dl', section: 'Meieri' },
      { name: 'Frisk koriander', quantity: 20, unit: 'g', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 38, name: 'Rask sopprisotto med kylling og tomat', emoji: '🍚',
    description: 'Kremet sopprisotto med stekt kylling og varme cherrytomater.',
    time_minutes: 20, price_level: 2, category: 'Annet',
    tags: ['Kylling', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Kyllingfilet', quantity: 2, unit: 'stk', section: 'Kjøtt & fisk' },
      { name: 'Risottoris med sopp (ferdigblanding)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Parmesan (revet)', quantity: 80, unit: 'g', section: 'Meieri' },
      { name: 'Cherrytomater', quantity: 200, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Smør', quantity: 4, unit: 'ss', section: 'Meieri' }
    ]
  },
  {
    id: 39, name: 'Rask butter chicken med kyllingkjøttboller', emoji: '🍛',
    description: 'Rask butter chicken med møre kyllingkjøttboller, ris og naanbrød.',
    time_minutes: 15, price_level: 2, category: 'Asiatisk',
    tags: ['Kylling', 'Asiatisk', 'Hverdags', 'Enkelt'],
    ingredients: [
      { name: 'Kyllingkjøttboller (ferske)', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Butter chicken-saus (ferdig)', quantity: 1, unit: 'pose', section: 'Krydder & sauser' },
      { name: 'Ris (porsjonspose)', quantity: 1, unit: 'stk', section: 'Tørrmat' },
      { name: 'Naanbrød', quantity: 4, unit: 'stk', section: 'Bakeri' },
      { name: 'Frisk koriander', quantity: 1, unit: 'håndfull', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 40, name: 'Lapskaus', emoji: '🍲',
    description: 'Enkel og god lapskaus med pølse, poteter og rotgrønnsaker – norsk husmannskost.',
    time_minutes: 20, price_level: 1, category: 'Suppe',
    tags: ['Kjøtt', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Gulrot', quantity: 4, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Kjøttpølse', quantity: 450, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Kålrot', quantity: 0.5, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Purre', quantity: 1, unit: 'stk', section: 'Frukt & grønt' },
      { name: 'Kjøttbuljong', quantity: 8, unit: 'dl', section: 'Krydder & sauser' },
      { name: 'Småpoteter med skall', quantity: 500, unit: 'g', section: 'Frukt & grønt' }
    ]
  },
  {
    id: 41, name: 'Pasta med kjøttboller i tomatsaus', emoji: '🍝',
    description: 'Rask og familievennlig pasta med kjøttboller i tomatsaus, basilikum og parmesan.',
    time_minutes: 20, price_level: 1, category: 'Pasta',
    tags: ['Kjøtt', 'Pasta', 'Barn', 'Enkelt', 'Hverdags'],
    ingredients: [
      { name: 'Tagliatelle (fersk)', quantity: 400, unit: 'g', section: 'Tørrmat' },
      { name: 'Kjøttboller i tomatsaus (ferdig)', quantity: 600, unit: 'g', section: 'Kjøtt & fisk' },
      { name: 'Frisk basilikum', quantity: 20, unit: 'g', section: 'Frukt & grønt' },
      { name: 'Parmesan (revet)', quantity: 80, unit: 'g', section: 'Meieri' }
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
  21: [
    'Skjær purre og gulrot i skiver, og skjær potetene i terninger.',
    'Kok opp fiskekraft med purre, gulrot og poteter, og la det småkoke til grønnsakene er nesten møre.',
    'Skjær torsk og laks i biter og ha dem i suppen sammen med fløten.',
    'La suppen trekke forsiktig i 5-8 minutter til fisken er gjennomstekt – ikke kok den hardt.',
    'Smak til med salt og pepper, og dryss over frisk dill før servering.',
  ],
  22: [
    'Kok spagettien al dente etter anvisning på pakken.',
    'Skjær baconet i terninger og stek det sprøtt i en panne sammen med finhakket hvitløk.',
    'Visp sammen egg, revet parmesan og godt med sort pepper i en bolle.',
    'Ha den nykokte, varme spagettien rett i pannen med bacon, og ta pannen av varmen.',
    'Rør raskt inn eggeblandingen slik at den blir kremet uten å stivne til eggerøre. Tilsett litt av kokevannet ved behov.',
    'Server umiddelbart med ekstra parmesan.',
  ],
  23: [
    'Skjær kyllingfileten i biter og finhakk løk, hvitløk og ingefær.',
    'Brun kyllingen i en gryte og ta den ut.',
    'Fres løk, hvitløk og ingefær myke i samme gryte.',
    'Tilsett tikka masala-saus, hermetiske tomater og kokosmelk, og kok opp.',
    'Ha kyllingen tilbake i gryta og la den trekke i sausen i 15-20 minutter.',
    'Kok jasminrisen etter anvisning på pakken og varm naanbrødet.',
    'Server kyllinggryta over ris med naanbrød ved siden av.',
  ],
  24: [
    'Brun lammekjøttet godt i en gryte i flere omganger, og ta det ut.',
    'Fres løk i samme gryte til den er blank.',
    'Ha lammekjøttet tilbake i gryta, dekk med vann og buljong, og kok opp.',
    'La gryta småkoke tildekket i ca. 1,5 time til kjøttet er mørt.',
    'Skjær poteter, gulrot og kålrot i grove biter og ha dem i gryta de siste 30 minuttene.',
    'Tilsett frisk rosmarin, smak til med salt og pepper, og server varmt.',
  ],
  25: [
    'Skjær poteter i skiver og løk i ringer.',
    'Fres løk, hvitløk og chili i olivenolje i en stor gryte eller ildfast form.',
    'Tilsett hermetiske tomater og la sausen småkoke i 10 minutter.',
    'Legg lag av potetskiver og utvannet klippfisk i sausen.',
    'La det hele trekke tildekket på svak varme i 25-30 minutter til fisken og potetene er møre.',
    'Strø over paprika og sorte oliven, og la det trekke 5 minutter til før servering.',
  ],
  // ── Oda-oppskrifter ──────────────────────────────────────────────────────
  26: [
    'Kok pastaen etter anvisning på pakken i saltet vann.',
    'Klapp kyllingskivene tørre og krydre med salt, pepper og paprikapulver. Stek i olje på middels-høy varme i 1-2 minutter per side, og ta ut av pannen.',
    'Skru ned varmen, ha fløte og parmesan i samme panne, og la det småkoke til sausen tykner litt.',
    'Tilsett babyspinat og la det falle sammen. Ha kyllingen tilbake i pannen og smak til.',
    'Vend inn den kokte pastaen og server rett fra pannen.',
  ],
  27: [
    'Kok pastaen etter anvisning på pakken, og ha i brokkolibukettene de siste 30 sekundene. Sil av og spar litt kokevann.',
    'Rør sammen crème fraîche, finhakket basilikum, limeskall og parmesan i gryta. Juster konsistensen med kokevann og smak til med salt og pepper. Vend inn pasta og brokkoli.',
    'Del laksefileten i porsjoner og krydre med salt og pepper.',
    'Legg laksen med skinnsiden ned i en kald panne med olje, skru opp varmen og stek i ca. 2 minutter.',
    'Snu laksen, dryss over limeskall og basilikum, og stek ferdig.',
    'Server laksen på den kremete brokkolipastaen.',
  ],
  28: [
    'Kok pastaen etter anvisning på pakken i saltet vann.',
    'Kok opp erter og kyllingbuljong i en kjele, og la det syde 1-2 minutter.',
    'Ha smør, parmesan, buljongen og halvparten av ertene i en blender og kjør til en jevn puré. Smak til med salt og pepper.',
    'Skjær salamien i strimler og stek den sprø i en panne på middels-høy varme i 2-3 minutter.',
    'Sil av pastaen og vend den med ertepuré, salami og resten av ertene. Topp med ekstra parmesan.',
  ],
  29: [
    'Sett ovnen på 215°C varmluft. Rens og skjær sjampinjongene i skiver, legg dem på en bakepapirkledd stekeplate, dryss over olivenolje og salt, og stek i ca. 15 minutter.',
    'Kok pastaen etter anvisning på pakken i saltet vann. Visp sammen egg, revet parmesan, salt og pepper i en bolle.',
    'Sil av pastaen, spar 1 dl kokevann. Ha pastaen tilbake i gryta sammen med eggeblandingen og den ovnsstekte soppen.',
    'Rør godt sammen og tynn ut med kokevann til ønsket konsistens. Smak til med salt og pepper, og dryss over frisk bladpersille.',
  ],
  30: [
    'Del blomkålen i mindre biter (ta gjerne med de lyse bladene også).',
    'Ha blomkål, melk, buljong og vann i en gryte og la det småkoke forsiktig i ca. 5 minutter uten å koke melken hardt.',
    'Ta gryta av varmen, rør inn crème fraîche og kjør suppen glatt med stavmikser. Smak til med muskat, salt og pepper.',
    'Skyll og la kikertene renne av seg godt, og klapp dem tørre.',
    'Stek kikertene med tacokrydder i olje på middels-høy varme i 2-3 minutter.',
    'Server suppen varm med de krydderstekte kikertene og hakket persille på toppen.',
  ],
  31: [
    'Kok nudlene etter anvisning på pakken, skyll i kaldt vann og sil av.',
    'Skrell og riv ingefær og limeskall. Rør sammen med ketjap manis, harissa og limesaft til en dressing.',
    'Vend den rå grønnsaksblandingen med dressingen i en bolle.',
    'Skjær eplet i tynne staver og vend eple og nudler inn i grønnsaksblandingen.',
    'Ha salaten over i en serveringsskål, og topp med hakket koriander, peanøtter og sprøstekt løk.',
  ],
  32: [
    'Varm tortillalefser og falafel etter anvisning på pakken. Skyll kikertene og la dem renne godt av seg.',
    'Kjør hvitløk, kikerter, avokado, sitronsaft, olivenolje og tahini glatt i en blender til hummus. Smak til med salt.',
    'Skjær agurk, tomat og rødløk i biter, og skyll rødløken grundig i kaldt vann.',
    'Fordel ruccola, falafel og avokadohummus på de varme lefsene sammen med grønnsakene.',
    'Rull sammen og server de fargerike falafelwrapsene.',
  ],
  33: [
    'Kok risen etter anvisning på pakken.',
    'Krydre laksefileten med salt og pepper på begge sider, og stek den i olje i en panne på middels-høy varme i ca. 2 minutter per side. Ta ut av pannen.',
    'Ha karripastaen i pannen og rør rundt kort. Hell i kokosmelken, kok opp og la det småkoke i ca. 2 minutter til det tykner.',
    'Skru ned varmen, tilsett basilikum og litt sitronsaft, og rør godt sammen.',
    'Ha laksen tilbake i pannen, øs saus over, og la den trekke ferdig et par minutter før servering med ris.',
  ],
  34: [
    'Skjær rødkål i strimler og sylteagurk i biter. Bland med crème fraîche og rå grønnsaksblanding, og smak til med salt.',
    'Krydre lakseburgerne lett med salt og pepper, og vend dem i semulegryn på begge sider.',
    'Stek burgerne i olje på middels varme i ca. 2 minutter per side – de blir ferdige av ettervarmen, så ikke stek dem for lenge.',
    'Rist hamburgerbrødene raskt i en tørr panne.',
    'Smør slaw på det nederste brødet, legg på ruccola, burger og toppen av brødet.',
    'Server med resten av grønnsaksslawen ved siden av.',
  ],
  35: [
    'Stek fiskepinnene og varm tortillalefsene etter anvisning på pakken.',
    'Damp sukkererter og del dem i to. Skjær agurk i staver og del cherrytomatene i kvarte. Del opp romanosalaten i blader.',
    'Rør sammen rømme, hakket dill, sukker og sitronsaft til en dilldressing. Smak til med salt og pepper.',
    'Server de varme fiskepinnene i wraps, og sett grønnsaker og dressing på bordet slik at alle kan fylle sin egen wrap.',
  ],
  36: [
    'Sett ovnen på 200°C. Legg kyllinglårene på rist med bakepapir under, og stek i ca. 15 minutter.',
    'Varm potetmos og peppersaus etter anvisning på pakken.',
    'Del brokkolien i små buketter, kok opp saltet vann og kok brokkolien i 2-3 minutter til den er mør med litt tyggemotstand.',
    'Server kyllinglårene med potetmos, peppersaus og brokkoli.',
  ],
  37: [
    'Kok risen etter anvisning på pakken.',
    'Skjær kyllingen i passe biter og stek i panne til den er lett gjennomstekt. Tilsett tikka masala-sausen og rør godt sammen.',
    'Vend inn crème fraîche og la det småkoke til kyllingen er gjennomstekt.',
    'Dryss over frisk koriander og server med ris.',
  ],
  38: [
    'Lag risottoen etter anvisning på pakken.',
    'Klapp kyllingfiletene tørre og krydre med salt, pepper og paprika. Stek i smør på høy varme i noen minutter per side, skru så ned varmen og la dem bli ferdig tildekket i 7-8 minutter. Ha i cherrytomatene mot slutten.',
    'Rør smør og parmesan inn i den ferdige risottoen.',
    'Server sopprisottoen med kyllingen og de varme tomatene.',
  ],
  39: [
    'Kok ris og varm naanbrød etter anvisning på pakken.',
    'Varm kyllingkjøttbollene i en panne med litt olje, tilsett sausen og la det trekke sammen til det er varmt gjennom.',
    'Server butter chicken med ris og naanbrød, og dryss over frisk koriander.',
  ],
  40: [
    'Vask, rens og skjær gulrot, poteter og kålrot i passe biter.',
    'Ha grønnsakene i en stor gryte med buljong, fyll på med vann til det dekker, kok opp og la det småkoke til grønnsakene er møre, ca. 15-20 minutter.',
    'Skjær pølse og purre i skiver, ha i gryta og la det trekke til pølsene er varme gjennom.',
    'Smak til med salt og pepper, og server varm.',
  ],
  41: [
    'Kok pastaen etter anvisning på pakken i saltet vann.',
    'Varm kjøttbollene i tomatsaus forsiktig i en kjele til de er varme gjennom.',
    'Topp pastaen med kjøttboller, frisk basilikum og revet parmesan.',
  ],
};
