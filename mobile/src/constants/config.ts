import { Platform } from 'react-native';

// På nettsiden ligger API-et på samme adresse som appen. I Expo Go må vi peke på den publiserte siden.
export const API_ORIGIN = Platform.OS === 'web' ? '' : 'https://handleklar-omega.vercel.app';

// Supabase-prosjektet «Mat app». Nøkkelen er den offentlige (publishable) nøkkelen
// og er laget for å ligge i appen; dataene beskyttes av husstandsnøkkelen.
export const SUPABASE_URL = 'https://ocryrmuvwthsceovybqx.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_C2_Cb7ugeYLDx61Ng2nedQ_CI9CA-of';
