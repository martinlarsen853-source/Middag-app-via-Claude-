# Handleklar – plan og status

Les denne før du gjør endringer i appen. Den samler prosjektdokumentet
(`docs/middag-app-konsept.pdf`), alt eieren har sagt underveis, og eierens egne
notater. «Du» betyr eieren av appen.

Sist oppdatert: 8. oktober 2026.

## Kjerneidé

En handleliste som fjerner hverdagsstresset rundt middag.

Du står i butikken, aner ikke hva du skal ha og orker ikke tenke. Du åpner
appen, scroller raskt gjennom middagene, velger én og butikken du er i. Da får
du handlelista i den rekkefølgen varene ligger, så du går raskeste vei gjennom
butikken uten å snu en eneste gang. Du trykker deg gjennom lista og er ferdig.

- Rundt 20 faste middager i rotasjon. Kjernen først, større ambisjoner senere.
- Enkel og rask å bruke, men skal se pen ut. Inspirert av matprat.no.
- Butikkene er Kiwi, Coop Extra og Rema 1000 i Spydeberg.

## Slik fungerer appen i dag

- **Middager:** kort med bilde, tid og pris. Søk og antall personer øverst.
- **Oppskrift:** ingredienser, fremgangsmåte og pris i hver butikk. «Billigst»
  er merket. Velg butikk for å lage handlelista.
- **Handleliste:** «Neste» stopp alltid øverst. Det du tar havner i «I kurven»
  nederst, der ett trykk legger det tilbake. «Angre» på siste vare.
- **Egne middager:** «Ny middag» med varesøk fra Kassalapp, eller fritekst.
  «Lag din versjon» på en fast middag erstatter originalen.
- **Butikker:** rekkefølgen er felles for alle og kan bare endres av eieren.
  Eiertelefonen settes opp på `/eier`.
- **Priser:** dagens pris per kjede fra Kassalapp, regnet i hele pakker.
  Ting du har hjemme (skjeer, salt, olje) telles ikke med. «ca.» betyr at minst
  én vare mangler ekte pris.

## Status

### Ferdig

- Store middagskort med bilde og pris, rask scrolling
- Personvelger som skalerer mengdene
- Handleliste sortert etter butikkens rute, med «Neste» øverst og «I kurven»
- Rekkefølge per butikk, felles og låst til eieren
- Egne middager med varesøk, lagret i Supabase
- Priser per butikk i hele pakker (ekte når Kassalapp-nøkkelen er lagt inn)
- Bunnmeny på mobil som i ukepenger-appen, toppmeny på PC
- Publisert som nettside som kan legges på hjemskjermen

### Neste – kjernen

1. **Flere middager på én liste.** «Legg på lista» på hver middag. Like varer
   slås sammen (kjøttdeig til taco og lasagne blir én linje med riktig antall
   pakker). Henger sammen med «skille mellom planlegging og shopping» under.
2. **Legg til egne varer i handlelista**, som Rema sin «Trykk for å legge til
   ny…». Varen havner automatisk på riktig stopp i ruta.
3. **Varebilde og størrelse på hver vare i handlelista**, så det er lett å
   kjenne igjen i hylla.
4. **Raskere søk i «Ny middag»** som hos Rema: søket står åpent, − 1 + rett på
   treffet, og fritekst som et tydelig valg.
5. **«Legg alt tilbake i listen»** i «I kurven».
6. **Kassalapp-nøkkelen** må legges inn i Vercel (`KASSALAPP_API_KEY`). Deretter
   kobles ekte varer til de faste middagene.
7. **Resten av de ~20 faste middagene.** Mangler bl.a. Madelén pasta og
   linseretten fra Ida Gran (eieren kan legge dem inn selv med «Ny middag»).
8. **Gå gjennom butikkene i Spydeberg** og rette rekkefølgen. Eierens jobb.

### Senere – fra prosjektdokumentet

- **Delt husholdning:** samboer ser hva du handler live, får beskjed om at
  «nå handles det» og kan legge til varer mens du er i butikken.
- **Lagre det som er handlet** i databasen, til bruk senere.
- **Sortering** etter tid, pris og «ikke spist på lenge».
- **Filter med dra-skalaer** for tid, pris per person og porsjoner.
- **Kjøleskapsoversikt:** se hva du har hjemme før du drar.
- **Rester og sparemiddag:** registrer det som er igjen («0,5 boks tomater, går
  ut om X dager») og få forslag til retter som bruker det opp.
- **Inspo-bibliotek:** 15 norske hverdagsmiddager og 15 Oda-retter. Ligger på
  den gamle nettsiden (`frontend/`), bevisst holdt utenfor appen inntil videre.
- **Innlogging og kontoer.** I dag brukes en skjult husstandsnøkkel i stedet.
- **Expo Go via EAS Update** (trenger `EXPO_TOKEN`). Nettsiden dekker dette nå.

### Senere – fra eierens notater («Matapp»)

Helse og næring:

- Glykemisk belastning og glykemisk indeks
- Protein per person
- Ultraprosessert mat
- Diabetesvennlig mat

Funksjoner:

- **AI som går gjennom handlelista eller middagslista** og foreslår endringer
  for å spare penger, med mulighet til å gjøre endringen. Det samme for protein.
- **AI som anbefaler retter** ut fra smak, næringsbehov og Helsedirektoratets
  anbefalinger.
- **Skille mellom oppskrifter og handleliste**, så appen også kan brukes som
  ren oppskriftsapp.
- **Skille mellom planlegging og shopping:** planlegg middagene hjemme, handle
  dem i butikken.
- **Bytte raskt når butikken ikke har varen.**
- **Erstatning for en ingrediens** («har ikke chili, hva gjør jeg?»): foreslå
  noe likt som passer i retten.
- **Pris per porsjon**, og hvor mange porsjoner det lønner seg å lage for
  billigst mulig pris. Mulig å regne ut fra dagens data, siden prisen allerede
  regnes i hele pakker.
- **Samboer kan sende middager til lista.**
- **HelloFresh-opplegg.** Tolkning, ikke bekreftet: en ferdig ukemeny med
  oppskriftskort og nøyaktige mengder.

## Åpne spørsmål til eieren

- Hva er Madelén pasta og linseretten fra Ida Gran? (Kan legges inn som egne
  middager.)
- Hva betyr «HelloFresh-opplegg» helt konkret?

## Ønsker for hvordan vi jobber

- Eieren har bare iPhone. Ingen Mac, ingen PC.
- Forklar enkelt på norsk, og legg ved lenke til guide når eieren må gjøre noe.
- Avslutt alltid svaret med lenken til appen: https://handleklar-omega.vercel.app
- Test i nettleser (headless Chromium) på mobil-, nettbrett- og PC-størrelse
  før publisering. «Ikke gi deg før alt funker.»
- Nøkler og passord skal aldri limes inn i chatten.
- Butikkrekkefølgen skal være 100 % riktig og kan bare endres av eieren.

## Teknisk

- **Appen:** Expo SDK 57 med expo-router i `mobile/`. Kjøres som nettside
  (`npx expo export --platform web`, output `dist/`).
- **Publisering:** Vercel-prosjektet `handleklar` er ikke koblet til GitHub.
  Publiser med Vercel `create_deployment` fra en commit på branchen, target
  production. Adresse: https://handleklar-omega.vercel.app. Den gamle nettsiden
  (`frontend/`, `api/`) er et eget prosjekt og er ikke appen.
- **API:** `mobile/api/search.ts` og `mobile/api/prices.ts` henter fra
  Kassalapp med nøkkelen på serveren. Uten nøkkel svarer de
  `unavailable: 'no_key'`, og appen viser anslag.
- **Database:** Supabase-prosjektet «Mat app» (`ocryrmuvwthsceovybqx`), eget
  skjema `handleklar` som ikke er eksponert. Appen bruker bare `hk_*`-funksjoner:
  - egne middager: `hk_create_household`, `hk_list_meals`, `hk_save_meal`,
    `hk_delete_meal` (husstandsnøkkel i appen, bare hashen lagres)
  - butikker: `hk_list_stores` (åpen), `hk_save_store` og `hk_hide_store`
    (krever eiernøkkel), `hk_check_owner`, `hk_owner_claim_open`,
    `hk_claim_owner` (gjør en telefon til eier én gang)
  - De gamle tabellene i `public` hører til den gamle nettsiden. Ikke rør dem.
- **Rute-systemet:** `src/lib/stops.ts` plasserer hver vare på et av 18 stopp.
  En butikk er en rekkefølge av stoppene.
- **Priser:** `src/lib/prices.ts` (hele pakker, kjede per butikk, «har hjemme»).
