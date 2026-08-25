import type { IGanpatiPandal } from '@/types/global';

/** Normalises the CSV string value for is_famous to a boolean. */
export const isFamous = (pandal: IGanpatiPandal): boolean =>
  pandal.is_famous?.toLowerCase() === 'true';
