// Oppskriftene, opprinnelig generert fra nettsidens oppskriftsbibliotek.
// Mengdene gjelder for fire personer (se BASE_PERSONS i lib/meals.ts).

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  section: string;
};

export type Meal = {
  id: number;
  name: string;
  emoji: string;
  description: string;
  timeMinutes: number;
  priceLevel: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
};


export const MEALS: Meal[] = [
  {
    "id": 2,
    "name": "Taco",
    "emoji": "🌮",
    "description": "Fredagstaco med krydret kjøttdeig, sprø skjell og alt tilbehøret.",
    "timeMinutes": 30,
    "priceLevel": 2,
    "category": "Meksikansk",
    "tags": [
      "Kjøtt",
      "Meksikansk",
      "Barn",
      "Helg",
      "Kos"
    ],
    "ingredients": [
      {
        "name": "Taco-skjell",
        "quantity": 12,
        "unit": "stk",
        "section": "Tørrmat"
      },
      {
        "name": "Kjøttdeig",
        "quantity": 500,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Tacokrydder",
        "quantity": 1,
        "unit": "pose",
        "section": "Krydder & sauser"
      },
      {
        "name": "Rømme",
        "quantity": 200,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Salsa",
        "quantity": 1,
        "unit": "glass",
        "section": "Krydder & sauser"
      },
      {
        "name": "Revet ost",
        "quantity": 200,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Salat",
        "quantity": 0.5,
        "unit": "hode",
        "section": "Frukt & grønt"
      },
      {
        "name": "Tomat",
        "quantity": 2,
        "unit": "stk",
        "section": "Frukt & grønt"
      }
    ],
    "steps": [
      "Brun kjøttdeigen i en panne til den er gjennomstekt.",
      "Tilsett tacokrydder og litt vann, og la det putre til sausen tykner.",
      "Skjær opp salat og tomat, og sett frem rømme, salsa og revet ost i skåler.",
      "Varm taco-skjellene i ovnen etter anvisning på pakken.",
      "La alle fylle sine egne skjell med kjøtt og tilbehør."
    ]
  },
  {
    "id": 42,
    "name": "Pinsa",
    "emoji": "🍕",
    "description": "Sprø pinsabunner med tomatsaus, mozzarella, spekeskinke og ruccola.",
    "timeMinutes": 20,
    "priceLevel": 2,
    "category": "Pizza",
    "tags": [
      "Gris",
      "Enkelt",
      "Helg",
      "Kos"
    ],
    "ingredients": [
      {
        "name": "Pinsabunner",
        "quantity": 4,
        "unit": "stk",
        "section": "Bakeri"
      },
      {
        "name": "Pizzasaus",
        "quantity": 1,
        "unit": "boks",
        "section": "Krydder & sauser"
      },
      {
        "name": "Mozzarella",
        "quantity": 250,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Spekeskinke",
        "quantity": 100,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Cherrytomater",
        "quantity": 200,
        "unit": "g",
        "section": "Frukt & grønt"
      },
      {
        "name": "Ruccola",
        "quantity": 1,
        "unit": "pose",
        "section": "Frukt & grønt"
      }
    ],
    "steps": [
      "Sett ovnen på 250 °C.",
      "Smør pizzasaus på pinsabunnene og riv mozzarellaen i biter over.",
      "Del cherrytomatene i to og legg dem på.",
      "Stek i 6–8 minutter til bunnen er sprø og osten bobler.",
      "Topp med spekeskinke og ruccola rett før servering."
    ]
  },
  {
    "id": 43,
    "name": "Svinestrimler i pita",
    "emoji": "🥙",
    "description": "Krydrede svinestrimler i varme pitabrød med friske grønnsaker og dressing.",
    "timeMinutes": 20,
    "priceLevel": 1,
    "category": "Kjøtt",
    "tags": [
      "Gris",
      "Enkelt",
      "Hverdags",
      "Barn"
    ],
    "ingredients": [
      {
        "name": "Svinestrimler",
        "quantity": 400,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Pitabrød",
        "quantity": 8,
        "unit": "stk",
        "section": "Bakeri"
      },
      {
        "name": "Pitakrydder",
        "quantity": 1,
        "unit": "pose",
        "section": "Krydder & sauser"
      },
      {
        "name": "Isbergsalat",
        "quantity": 0.5,
        "unit": "hode",
        "section": "Frukt & grønt"
      },
      {
        "name": "Tomat",
        "quantity": 2,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Agurk",
        "quantity": 1,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Rødløk",
        "quantity": 1,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Hvitløksdressing",
        "quantity": 1,
        "unit": "flaske",
        "section": "Krydder & sauser"
      }
    ],
    "steps": [
      "Stek svinestrimlene i litt olje på høy varme til de er gjennomstekt.",
      "Strø over pitakrydder og stek et minutt til.",
      "Skjær salat, tomat, agurk og rødløk.",
      "Varm pitabrødene i brødristeren eller ovnen.",
      "Fyll pitaene med kjøtt, grønnsaker og dressing."
    ]
  },
  {
    "id": 1,
    "name": "Pasta bolognese",
    "emoji": "🍝",
    "description": "Klassisk kjøttsaus med pasta — alltid en favoritt hos hele familien.",
    "timeMinutes": 45,
    "priceLevel": 2,
    "category": "Pasta",
    "tags": [
      "Kjøtt",
      "Pasta",
      "Kos",
      "Hverdags"
    ],
    "ingredients": [
      {
        "name": "Spaghetti",
        "quantity": 400,
        "unit": "g",
        "section": "Tørrmat"
      },
      {
        "name": "Kjøttdeig",
        "quantity": 600,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Hermetiske tomater",
        "quantity": 2,
        "unit": "boks",
        "section": "Tørrmat"
      },
      {
        "name": "Løk",
        "quantity": 2,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Hvitløk",
        "quantity": 3,
        "unit": "fedd",
        "section": "Frukt & grønt"
      },
      {
        "name": "Parmesan",
        "quantity": 100,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Tomatpuré",
        "quantity": 2,
        "unit": "ss",
        "section": "Krydder & sauser"
      },
      {
        "name": "Olivenolje",
        "quantity": 2,
        "unit": "ss",
        "section": "Krydder & sauser"
      }
    ],
    "steps": [
      "Finhakk løk og hvitløk, og fres dem myke i olivenolje i en gryte.",
      "Tilsett kjøttdeigen og brun den godt til den er smuldret og gjennomstekt.",
      "Rør inn tomatpuré, og ha i de hermetiske tomatene. La sausen småkoke i minst 20 minutter.",
      "Kok spagettien al dente etter anvisning på pakken.",
      "Smak til sausen med salt og pepper, og server over spagettien med revet parmesan."
    ]
  },
  {
    "id": 44,
    "name": "Fiskekaker i potetmos",
    "emoji": "🐟",
    "description": "Stekte fiskekaker med hjemmelaget potetmos og kokte gulrøtter.",
    "timeMinutes": 30,
    "priceLevel": 1,
    "category": "Fisk",
    "tags": [
      "Fisk",
      "Barn",
      "Hverdags"
    ],
    "ingredients": [
      {
        "name": "Fiskekaker",
        "quantity": 600,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Poteter",
        "quantity": 1000,
        "unit": "g",
        "section": "Frukt & grønt"
      },
      {
        "name": "Melk",
        "quantity": 200,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Smør",
        "quantity": 50,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Gulrot",
        "quantity": 4,
        "unit": "stk",
        "section": "Frukt & grønt"
      }
    ],
    "steps": [
      "Skrell potetene og kok dem møre i lettsaltet vann.",
      "Skrell gulrøttene, del dem i staver og kok dem møre.",
      "Stek fiskekakene i litt smør på middels varme til de er gylne og varme.",
      "Mos potetene med varm melk og smør, og smak til med salt og pepper.",
      "Server fiskekakene på potetmosen med gulrøttene ved siden av."
    ]
  },
  {
    "id": 11,
    "name": "Pannekaker",
    "emoji": "🥞",
    "description": "Tynne og myke norske pannekaker med rømme og jordbærsyltetøy. Barna elsker det!",
    "timeMinutes": 20,
    "priceLevel": 1,
    "category": "Enkelt",
    "tags": [
      "Vegetar",
      "Enkelt",
      "Barn",
      "Kos"
    ],
    "ingredients": [
      {
        "name": "Mel",
        "quantity": 300,
        "unit": "g",
        "section": "Tørrmat"
      },
      {
        "name": "Egg",
        "quantity": 4,
        "unit": "stk",
        "section": "Meieri"
      },
      {
        "name": "Melk",
        "quantity": 600,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Smør",
        "quantity": 50,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Rømme",
        "quantity": 200,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Jordbærsyltetøy",
        "quantity": 1,
        "unit": "glass",
        "section": "Tørrmat"
      }
    ],
    "steps": [
      "Visp sammen mel, egg og melk til en glatt røre og la den svelle i 15 minutter.",
      "Smelt litt smør i en panne på middels varme.",
      "Hell i røre og stek pannekakene gylne på begge sider.",
      "Hold pannekakene varme mens du steker resten.",
      "Server med rømme og jordbærsyltetøy."
    ]
  },
  {
    "id": 14,
    "name": "Laks med potet",
    "emoji": "🐟",
    "description": "Ovnsbakt laks med kokte poteter, brokkoli og frisk dill.",
    "timeMinutes": 30,
    "priceLevel": 3,
    "category": "Fisk",
    "tags": [
      "Fisk",
      "Helg",
      "Hverdags"
    ],
    "ingredients": [
      {
        "name": "Laksefilet",
        "quantity": 700,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Sitron",
        "quantity": 1,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Poteter",
        "quantity": 600,
        "unit": "g",
        "section": "Frukt & grønt"
      },
      {
        "name": "Brokkoli",
        "quantity": 1,
        "unit": "hode",
        "section": "Frukt & grønt"
      },
      {
        "name": "Dill",
        "quantity": 0.5,
        "unit": "bunt",
        "section": "Frukt & grønt"
      },
      {
        "name": "Smør",
        "quantity": 40,
        "unit": "g",
        "section": "Meieri"
      }
    ],
    "steps": [
      "Sett ovnen på 200 °C og skrell potetene.",
      "Legg laksefileten i en ildfast form, krydre med salt og pepper, og legg på smørklatter og sitronskiver.",
      "Kok potetene og damp brokkolien mør.",
      "Stek laksen i ovnen i 15-20 minutter til den akkurat er gjennomstekt.",
      "Dryss over frisk dill og server med poteter og brokkoli."
    ]
  },
  {
    "id": 45,
    "name": "Bakt potet",
    "emoji": "🥔",
    "description": "Store ovnsbakte poteter fylt med rømme, sprøstekt bacon, mais og ost.",
    "timeMinutes": 70,
    "priceLevel": 1,
    "category": "Enkelt",
    "tags": [
      "Gris",
      "Barn",
      "Kos"
    ],
    "ingredients": [
      {
        "name": "Bakepoteter",
        "quantity": 4,
        "unit": "stk",
        "section": "Frukt & grønt"
      },
      {
        "name": "Bacon",
        "quantity": 200,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Rømme",
        "quantity": 300,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Revet ost",
        "quantity": 150,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Mais",
        "quantity": 1,
        "unit": "boks",
        "section": "Tørrmat"
      },
      {
        "name": "Vårløk",
        "quantity": 1,
        "unit": "bunt",
        "section": "Frukt & grønt"
      },
      {
        "name": "Hvitløk",
        "quantity": 1,
        "unit": "fedd",
        "section": "Frukt & grønt"
      }
    ],
    "steps": [
      "Sett ovnen på 200 °C. Vask potetene, prikk dem med en gaffel og stek dem i ca. 60 minutter til de er myke.",
      "Stek baconet sprøtt og del det i biter.",
      "Rør rømmen med finrevet hvitløk og litt salt.",
      "Hakk vårløken og la maisen renne av seg.",
      "Skjær et kryss i potetene, klem dem opp og fyll med rømme, bacon, mais, ost og vårløk."
    ]
  },
  {
    "id": 19,
    "name": "Lasagne",
    "emoji": "🫙",
    "description": "Italiensk lasagne med saftig kjøttsaus, kremet bechamel og sprø ostetopp.",
    "timeMinutes": 70,
    "priceLevel": 2,
    "category": "Pasta",
    "tags": [
      "Kjøtt",
      "Pasta",
      "Langtids",
      "Fest",
      "Kos"
    ],
    "ingredients": [
      {
        "name": "Lasagneplater",
        "quantity": 250,
        "unit": "g",
        "section": "Tørrmat"
      },
      {
        "name": "Kjøttdeig",
        "quantity": 600,
        "unit": "g",
        "section": "Kjøtt & fisk"
      },
      {
        "name": "Hermetiske tomater",
        "quantity": 2,
        "unit": "boks",
        "section": "Tørrmat"
      },
      {
        "name": "Melk",
        "quantity": 500,
        "unit": "ml",
        "section": "Meieri"
      },
      {
        "name": "Mel",
        "quantity": 4,
        "unit": "ss",
        "section": "Tørrmat"
      },
      {
        "name": "Smør",
        "quantity": 60,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Revet ost",
        "quantity": 200,
        "unit": "g",
        "section": "Meieri"
      },
      {
        "name": "Løk",
        "quantity": 1,
        "unit": "stk",
        "section": "Frukt & grønt"
      }
    ],
    "steps": [
      "Finhakk løk og fres den blank, tilsett kjøttdeig og brun den.",
      "Rør inn hermetiske tomater og la kjøttsausen småkoke.",
      "Lag en hvit saus av smør, mel og melk.",
      "Sett ovnen på 200 °C.",
      "Lag lag i en ildfast form med kjøttsaus, lasagneplater og hvit saus, og avslutt med revet ost.",
      "Stek lasagnen i ovnen i ca. 40 minutter til den er gyllen."
    ]
  }
];
