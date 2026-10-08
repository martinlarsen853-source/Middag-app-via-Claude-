// Oppskriftene, opprinnelig generert fra nettsidens oppskriftsbibliotek.
// Mengdene gjelder for fire personer (se BASE_PERSONS i lib/meals.ts).

// En ekte vare fra Kassalapp. Pakkestørrelsen brukes til å regne ut hvor
// mange pakker som må kjøpes, og strekkoden til å hente dagens pris per kjede.
export type Product = {
  ean: string;
  name: string;
  image?: string | null;
  packSize?: number | null;
  packUnit?: string | null;
};

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  section: string;
  product?: Product;
  // Basisvarer man som regel har hjemme (salt, olje, en skje mel). De står på
  // lista, men telles ikke med i prisen.
  pantry?: boolean;
};

export type Meal = {
  // Tall for de faste rettene, tekst (uuid) for egne middager fra databasen.
  id: number | string;
  name: string;
  emoji: string;
  description: string;
  timeMinutes: number;
  priceLevel: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  // Antall personer mengdene gjelder for. Mangler den, gjelder BASE_PERSONS.
  basePersons?: number;
  // Satt på egne middager. basedOn peker på en fast rett den erstatter.
  custom?: boolean;
  basedOn?: number;
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
        "section": "Tørrmat",
        "product": {
          "ean": "7035620045776",
          "name": "Tacoskjell 12stk 135g First Price",
          "image": null,
          "packSize": 12,
          "packUnit": "stk"
        }
      },
      {
        "name": "Kjøttdeig",
        "quantity": 500,
        "unit": "g",
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7037203635732",
          "name": "Gilde Kjøttdeig 14% uten Salt og Vann 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "7038010005459",
          "name": "Lettrømme 17% 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
      },
      {
        "name": "Salsa",
        "quantity": 1,
        "unit": "glass",
        "section": "Krydder & sauser",
        "product": {
          "ean": "7311312002112",
          "name": "Tacosaus Medium 230g Santa Maria",
          "image": null,
          "packSize": 230,
          "packUnit": "g"
        }
      },
      {
        "name": "Revet ost",
        "quantity": 200,
        "unit": "g",
        "section": "Meieri",
        "product": {
          "ean": "7038010014307",
          "name": "Revet Ost Original 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
      },
      {
        "name": "Salat",
        "quantity": 0.5,
        "unit": "hode",
        "section": "Frukt & grønt",
        "product": {
          "ean": "8437017206200",
          "name": "Isbergsalat stykk",
          "image": null,
          "packSize": 1,
          "packUnit": "stk"
        }
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
        "section": "Bakeri",
        "product": {
          "ean": "7035620060243",
          "name": "Pinsa 230g Eldorado",
          "image": null,
          "packSize": 1,
          "packUnit": "stk"
        }
      },
      {
        "name": "Pizzasaus",
        "quantity": 1,
        "unit": "boks",
        "section": "Krydder & sauser",
        "product": {
          "ean": "7035620072369",
          "name": "Pizzasaus 340g First Price",
          "image": null,
          "packSize": 340,
          "packUnit": "g"
        }
      },
      {
        "name": "Mozzarella",
        "quantity": 250,
        "unit": "g",
        "section": "Meieri",
        "product": {
          "ean": "7038010022364",
          "name": "Mozzarella Norsk 250g Tine",
          "image": null,
          "packSize": 250,
          "packUnit": "g"
        }
      },
      {
        "name": "Spekeskinke",
        "quantity": 100,
        "unit": "g",
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7037203636852",
          "name": "Spekeskinke Siliana 80g Gilde",
          "image": null,
          "packSize": 80,
          "packUnit": "g"
        }
      },
      {
        "name": "Cherrytomater",
        "quantity": 200,
        "unit": "g",
        "section": "Frukt & grønt",
        "product": {
          "ean": "7040515003229",
          "name": "Røde cherrytomater Norge, 250 g",
          "image": null,
          "packSize": 250,
          "packUnit": "g"
        }
      },
      {
        "name": "Ruccola",
        "quantity": 1,
        "unit": "pose",
        "section": "Frukt & grønt",
        "product": {
          "ean": "7031540011495",
          "name": "Ruccola 70g",
          "image": null,
          "packSize": 70,
          "packUnit": "g"
        }
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
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7020098004554",
          "name": "Svinestrimler 500g First Price",
          "image": null,
          "packSize": 500,
          "packUnit": "g"
        }
      },
      {
        "name": "Pitabrød",
        "quantity": 8,
        "unit": "stk",
        "section": "Bakeri",
        "product": {
          "ean": "7035620065385",
          "name": "Pitabrød Hvete 480g Eldorado",
          "image": null,
          "packSize": 480,
          "packUnit": "g"
        }
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
        "section": "Frukt & grønt",
        "product": {
          "ean": "8437017206200",
          "name": "Isbergsalat stykk",
          "image": null,
          "packSize": 1,
          "packUnit": "stk"
        }
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
        "section": "Krydder & sauser",
        "product": {
          "ean": "7043570004934",
          "name": "Hvitløksdressing 300ml",
          "image": null,
          "packSize": 300,
          "packUnit": "ml"
        }
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
        "section": "Tørrmat",
        "product": {
          "ean": "8001250120120",
          "name": "Spaghetti 500g De Cecco",
          "image": null,
          "packSize": 500,
          "packUnit": "g"
        }
      },
      {
        "name": "Kjøttdeig",
        "quantity": 600,
        "unit": "g",
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7037203635732",
          "name": "Gilde Kjøttdeig 14% uten Salt og Vann 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
      },
      {
        "name": "Hermetiske tomater",
        "quantity": 2,
        "unit": "boks",
        "section": "Tørrmat",
        "product": {
          "ean": "9800001078364",
          "name": "Hakkede Tomater 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "5420024121126",
          "name": "Michelangelo Parmesan stick 125g",
          "image": null,
          "packSize": 125,
          "packUnit": "g"
        }
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
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7035620049101",
          "name": "Fiskekaker 80% 500g Fiskemannen",
          "image": null,
          "packSize": 500,
          "packUnit": "g"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "7038010068065",
          "name": "Lettmelk 0,5% 0,5l Tine",
          "image": null,
          "packSize": 500,
          "packUnit": "ml"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "7035620050688",
          "name": "Gårdsegg M/L 12stk Eldorado",
          "image": null,
          "packSize": 12,
          "packUnit": "stk"
        }
      },
      {
        "name": "Melk",
        "quantity": 600,
        "unit": "ml",
        "section": "Meieri",
        "product": {
          "ean": "7038010068065",
          "name": "Lettmelk 0,5% 0,5l Tine",
          "image": null,
          "packSize": 500,
          "packUnit": "ml"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "7038010005459",
          "name": "Lettrømme 17% 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
      },
      {
        "name": "Jordbærsyltetøy",
        "quantity": 1,
        "unit": "glass",
        "section": "Tørrmat",
        "product": {
          "ean": "7070841005383",
          "name": "Jordbærsyltetøy Klem 410g Lerum",
          "image": null,
          "packSize": 410,
          "packUnit": "g"
        }
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
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7055330036369",
          "name": "Laksefilet 450g Fersk&Ferdig",
          "image": null,
          "packSize": 450,
          "packUnit": "g"
        }
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
        "section": "Frukt & grønt",
        "product": {
          "ean": "7031540000277",
          "name": "Brokkoli 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
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
        "section": "Frukt & grønt",
        "product": {
          "ean": "4367",
          "name": "Bakepotet Bama",
          "image": null,
          "packSize": 1,
          "packUnit": "stk"
        }
      },
      {
        "name": "Bacon",
        "quantity": 200,
        "unit": "g",
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "5707196315844",
          "name": "Bacon skivet Bøkeflisrøkt 125g Tulip",
          "image": null,
          "packSize": 125,
          "packUnit": "g"
        }
      },
      {
        "name": "Rømme",
        "quantity": 300,
        "unit": "ml",
        "section": "Meieri",
        "product": {
          "ean": "7038010005459",
          "name": "Lettrømme 17% 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
      },
      {
        "name": "Revet ost",
        "quantity": 150,
        "unit": "g",
        "section": "Meieri",
        "product": {
          "ean": "7038010014307",
          "name": "Revet Ost Original 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
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
        "section": "Tørrmat",
        "product": {
          "ean": "7035620041624",
          "name": "Lasagneplater 500g Eldorado",
          "image": null,
          "packSize": 500,
          "packUnit": "g"
        }
      },
      {
        "name": "Kjøttdeig",
        "quantity": 600,
        "unit": "g",
        "section": "Kjøtt & fisk",
        "product": {
          "ean": "7037203635732",
          "name": "Gilde Kjøttdeig 14% uten Salt og Vann 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
      },
      {
        "name": "Hermetiske tomater",
        "quantity": 2,
        "unit": "boks",
        "section": "Tørrmat",
        "product": {
          "ean": "9800001078364",
          "name": "Hakkede Tomater 400g",
          "image": null,
          "packSize": 400,
          "packUnit": "g"
        }
      },
      {
        "name": "Melk",
        "quantity": 500,
        "unit": "ml",
        "section": "Meieri",
        "product": {
          "ean": "7038010068065",
          "name": "Lettmelk 0,5% 0,5l Tine",
          "image": null,
          "packSize": 500,
          "packUnit": "ml"
        }
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
        "section": "Meieri",
        "product": {
          "ean": "7038010014307",
          "name": "Revet Ost Original 300g Tine",
          "image": null,
          "packSize": 300,
          "packUnit": "g"
        }
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
