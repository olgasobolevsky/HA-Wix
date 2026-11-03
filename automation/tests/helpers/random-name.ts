import { randomInt } from 'node:crypto';

/** 16 random lowercase letters, a fresh value per call. Used as a free name; never regenerate on a "taken" answer. */
export function randomLabel(length = 16): string {
  let label = '';
  for (let i = 0; i < length; i++) label += String.fromCharCode(97 + randomInt(26));
  return label;
}
