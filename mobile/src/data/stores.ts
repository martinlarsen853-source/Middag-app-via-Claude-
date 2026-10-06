import type { StopId } from '@/lib/stops';

export type Store = {
  id: string;
  name: string;
  stops: StopId[];
  // Butikker brukeren har lagt til selv kan slettes; startbutikkene kan bare tilbakestilles.
  custom?: boolean;
};

// Startgjetninger basert på kjedenes vanlige oppsett. De er ment å bli rettet
// på stedet: gå gjennom butikken og flytt stoppene til rekkefølgen stemmer.
export const DEFAULT_STORES: Store[] = [
  {
    id: 'rema-1000',
    name: 'Rema 1000',
    stops: [
      'frukt-gront', 'brod', 'kjott', 'fisk', 'palegg', 'ferdigmat', 'meieri', 'ost', 'egg',
      'pasta-ris', 'hermetikk', 'verdensmat', 'sauser', 'krydder', 'baking', 'snacks', 'frys', 'annet',
    ],
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    stops: [
      'frukt-gront', 'kjott', 'fisk', 'palegg', 'ferdigmat', 'meieri', 'ost', 'egg', 'brod',
      'pasta-ris', 'hermetikk', 'verdensmat', 'baking', 'snacks', 'frys', 'sauser', 'krydder', 'annet',
    ],
  },
  {
    id: 'coop-extra',
    name: 'Coop Extra',
    stops: [
      'brod', 'frukt-gront', 'kjott', 'fisk', 'palegg', 'ferdigmat', 'meieri', 'ost', 'egg', 'frys',
      'pasta-ris', 'hermetikk', 'verdensmat', 'sauser', 'krydder', 'baking', 'snacks', 'annet',
    ],
  },
];
