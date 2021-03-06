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
import { lbeta_scalar } from '@special/beta/lbeta';
import { pbeta } from '@dist/beta/pbeta';
import { ML_ERR_return_NAN  } from '@common/logger';
import { M_LN2, R_D_Cval, R_DT_0, R_DT_1 } from '$constants';
import { pnorm5 as pnorm } from '@dist/normal/pnorm';

const printer = debug('pt');

export function pt(x: number, n: number, lowerTail = true, log_p = false): number {
    /* return  P[ T <= x ]	where
     * T ~ t_{n}  (t distrib. with n degrees of freedom).
    
     *	--> ./pnt.c for NON-central
     */
    let val;
    //let nx;

    let lower_tail = lowerTail;

    if (isNaN(x) || isNaN(n)) return x + n;

    if (n <= 0.0) {
        return ML_ERR_return_NAN(printer);
    }

    if (!isFinite(x)) {
        return x < 0 ? R_DT_0(lower_tail, log_p) : R_DT_1(lower_tail, log_p);
    }

    if (!isFinite(n)) {
        return pnorm(x, 0.0, 1.0, lower_tail, log_p);
    }

    if (n > 4e5) {
        /*-- Fixme(?): test should depend on `n' AND `x' ! */
        /* Approx. from	 Abramowitz & Stegun 26.7.8 (p.949) */
        val = 1 / (4 * n);
        return pnorm((x * (1 - val)) / Math.sqrt(1 + x * x * 2 * val), 0.0, 1.0, lower_tail, log_p);
    }

    const nx = 1 + (x / n) * x;
    /* FIXME: This test is probably losing rather than gaining precision,
     * now that pbeta(*, log_p = TRUE) is much better.
     * Note however that a version of this test *is* needed for x*x > D_MAX */
    if (nx > 1e100) {
        /* <==>  x*x > 1e100 * n  */
        /* Danger of underflow. So use Abramowitz & Stegun 26.5.4
           pbeta(z, a, b) ~ z^a(1-z)^b / aB(a,b) ~ z^a / aB(a,b),
           with z = 1/nx,  a = n/2,  b= 1/2 :
        */
        //let lval;
        const lval = -0.5 * n * (2 * Math.log(Math.abs(x)) - Math.log(n)) - lbeta_scalar(0.5 * n, 0.5) - Math.log(0.5 * n);
        val = log_p ? lval : Math.exp(lval);
    } else {
        val =
            n > x * x
                ? pbeta((x * x) / (n + x * x), 0.5, n / 2, /*lower_tail*/ false, log_p)
                : pbeta(1 / nx, n / 2, 0.5, /*lower_tail*/ true, log_p);
    }

    /* Use "1 - v"  if	lower_tail  and	 x > 0 (but not both):*/
    if (x <= 0) {
        lower_tail = !lower_tail;
    }

    if (log_p) {
        if (lower_tail) {
            return Math.log1p(-0.5 * Math.exp(val));
        } else {
            return val - M_LN2; /* = Math.log(.5* pbeta(....)) */
        }
    } else {
        val /= 2;
        return R_D_Cval(lower_tail, val);
    }
}
