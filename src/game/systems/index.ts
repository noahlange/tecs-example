import { parallel, sequence } from 'tecs';

export const sync = sequence();
export const async = parallel();
