'use strict';
export { uniform } from './uniform';
export { normal } from './normal';
export { logNormal } from './normal/lognormal';
export { rng, IRNG } from './rng';
export { beta } from '~beta';
export { poisson } from './poisson';
export { cauchy } from './cauchy';
export { binomial } from './binomial';
export { chiSquared } from './chi-2';
import { special as betaSpecial } from '~beta';
import { special as gammaSpecial } from '~gamma';

export const special = Object.freeze({
  ...gammaSpecial,
  ...betaSpecial
});

//export * as rfunc from './r-func';

//https://github.com/Microsoft/TypeScript/pull/19852
//Fix declaration emit for exported export alias specifiers

export * from './bessel';
//export * from './beta';

export * from './chebyshev';
export * from './chi-2';
//export * from './common';
//export * from './deviance';
//export * from './exp';
export * from './f-distro';
//export * from './gamma';
export * from './geometric';
export * from './hypergeometric';
//export * from './rng';
export * from './r-func';
export * from './bessel';
//export * from './beta';
export * from './binomial';
export * from './binomial-negative';

//export * from './poisson';
