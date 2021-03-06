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
import { ML_ERR_return_NAN,  } from '@common/logger';
import { M_LN_SQRT_PI, R_D__0 } from '$constants';
import { lgammaOne } from '@special/gamma';
import { dnorm } from '@dist/normal';
import { dt } from './dt';
import { pnt } from './pnt';

const printer_dnt = debug('dnt');
export function dnt(x: number, df: number, ncp = 0, giveLog = false): number {
    if (isNaN(x) || isNaN(df)) return x + df;

    /* If non-positive df then error */
    if (df <= 0.0) return ML_ERR_return_NAN(printer_dnt);

    if (ncp === 0.0) return dt(x, df, giveLog);

    /* If x is infinite then return 0 */
    if (!isFinite(x)) return R_D__0(giveLog);

    /* If infinite df then the density is identical to a
     normal distribution with mean = ncp.  However, the formula
     loses a lot of accuracy around df=1e9
  */
    if (!isFinite(df) || df > 1e8) return dnorm(x, ncp, 1, giveLog);

    /* Do calculations on log scale to stabilize */

    /* Consider two cases: x ~= 0 or not */
    const u = (function () {
        if (Math.abs(x) > Math.sqrt(df * Number.EPSILON)) {
            printer_dnt('Math.abs(x:%d)>Math.sqrt(df*espsilon):%d', Math.abs(x), Math.sqrt(df * Number.EPSILON));
            return (
                Math.log(df) -
                Math.log(Math.abs(x)) +
                Math.log(Math.abs(pnt(x * Math.sqrt((df + 2) / df), df + 2, ncp, true, false) - pnt(x, df, ncp, true, false)))
            );
            /* FIXME: the above still suffers from cancellation (but not horribly) */
        } else {
            /* x ~= 0 : -> same value as for  x = 0 */
            printer_dnt('Math.abs(x:%d)<=Math.sqrt(df*espsilon):%d', Math.abs(x), Math.sqrt(df * Number.EPSILON));
            return lgammaOne((df + 1) / 2) - lgammaOne(df / 2) - (M_LN_SQRT_PI + 0.5 * (Math.exp(df) + ncp * ncp));
        }
    })();
    printer_dnt('u=%d, giveLog=%s', u, giveLog);
    return giveLog ? u : Math.exp(u);
}
