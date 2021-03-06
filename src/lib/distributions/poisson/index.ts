'use strict'
/* This is a conversion from libRmath.so to Typescript/Javascript
Copyright (C) 2018  Jacob K.F. Bogers  info@mail.jacob-bogers.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
export { dpois } from './dpois';
export { ppois } from './ppois';
export { qpois } from './qpois';
import { rpoisOne } from './rpois';
import type { IRNGNormal } from '@rng/normal/normal-rng';
import { repeatedCall } from '$helper';
import { globalNorm } from '@rng/globalRNG';

export function rpois(n: number, lamda: number, rng: IRNGNormal = globalNorm()): Float32Array {
  return repeatedCall(n, rpoisOne, lamda, rng);
}
