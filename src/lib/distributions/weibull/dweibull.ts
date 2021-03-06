'use strict';
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

import { debug } from 'debug';

import { ML_ERR_return_NAN } from '@common/logger';
import { R_D__0 } from '$constants';
const printer = debug('dweilbull');

export function dweibull(x: number, shape: number, scale = 1, give_log = false): number {
    if (isNaN(x) || isNaN(shape) || isNaN(scale)) return x + shape + scale;
    if (shape <= 0 || scale <= 0) return ML_ERR_return_NAN(printer);

    if (x < 0) return R_D__0(give_log);
    if (!isFinite(x)) return R_D__0(give_log);
    /* need to handle x == 0 separately */
    if (x === 0 && shape < 1) return Infinity;
    const tmp1 = Math.pow(x / scale, shape - 1);
    const tmp2 = tmp1 * (x / scale);
    /* These are incorrect if tmp1 == 0 */
    return give_log ? -tmp2 + Math.log((shape * tmp1) / scale) : (shape * tmp1 * Math.exp(-tmp2)) / scale;
}
