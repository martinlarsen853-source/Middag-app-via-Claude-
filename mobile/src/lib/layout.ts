import { useWindowDimensions } from 'react-native';

import { MAX_WIDTH } from '@/constants/theme';

export type Layout = {
  width: number;
  // Toppmeny på brede skjermer, menyknapper i bunnen på telefon.
  wide: boolean;
  gutter: number;
  contentWidth: number;
  columns: number;
};

export function useLayout(): Layout {
  const { width } = useWindowDimensions();
  const wide = width >= 768;
  const gutter = width >= 1024 ? 32 : width >= 600 ? 24 : 16;
  const contentWidth = Math.min(width, MAX_WIDTH + gutter * 2) - gutter * 2;
  const columns = width >= 1200 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1;
  return { width, wide, gutter, contentWidth, columns };
}
