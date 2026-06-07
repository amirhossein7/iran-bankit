/**
 * Map of bank ID → raw SVG string for every Iranian bank that has a logo.
 * Import this only when you need logos — it is a separate entry point so
 * bundlers can omit it when unused.
 *
 * @example
 * import { logos } from 'iran-bankit/logos';
 * import { getBankByCard } from 'iran-bankit';
 *
 * const bank = getBankByCard('6104331234567890');
 * const svg = bank?.logo ? logos[bank.logo] : null;
 *
 * // Use as an inline SVG element:
 * element.innerHTML = svg ?? '';
 *
 * // Or as a data URI in an <img>:
 * imgEl.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg ?? '')}`;
 */
export declare const logos: Record<string, string>;
