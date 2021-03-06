/* This is a conversion from LIB-R-MATH to Typescript/Javascript
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
import { R_DT_0, R_DT_1 } from '$constants';
import { NumberW, Toms708 } from '$toms708';

const printer_pbeta_raw = debug('pbeta_raw');

export function pbeta_raw(x: number, a: number, b: number, lower_tail: boolean, log_p: boolean): number {
    // treat limit cases correctly here:
    //if (a === 0 || b === 0 || !isFinite(a) || !isFinite(b)) {
    // NB:  0 < x < 1 :
    if (a === 0 && b === 0)
        // point mass 1/2 at each of {0,1} :
        return log_p ? -Math.LN2 : 0.5;
    if (a === 0 || a / b === 0)
        // point mass 1 at 0 ==> P(X <= x) = 1, all x > 0
        return R_DT_1(lower_tail, log_p);
    if (b === 0 || b / a === 0)
        // point mass 1 at 1 ==> P(X <= x) = 0, all x < 1
        return R_DT_0(lower_tail, log_p);
    // else, remaining case:  a = b = Inf : point mass 1 at 1/2
    if (!isFinite(a) || !isFinite(b)) {
        if (x < 0.5) return R_DT_0(lower_tail, log_p);
        else return R_DT_1(lower_tail, log_p);
    }
    //}
    // Now:  0 < a < Inf;  0 < b < Inf
    const x1 = 0.5 - x + 0.5;
    const w: NumberW = new NumberW(0);
    const wc: NumberW = new NumberW(0);
    const ierr: NumberW = new NumberW(0);
    //====
    //Toms708.bratio(a, b, x, x1, &w, &wc, &ierr, log_p); /* -> ./toms708.c */
    printer_pbeta_raw('before Toms708.bratio, a=%d, b=%d, x=%d, w=%d,wc=%d, ierr=%d', a, b, x, w.val, wc.val, ierr.val);
    Toms708.bratio(a, b, x, x1, w, wc, ierr); /* -> ./toms708.c */
    printer_pbeta_raw('after Toms708.bratio, a=%d, b=%d, x=%d, w=%d,wc=%d, ierr=%d', a, b, x, w.val, wc.val, ierr.val);
    //====
    // ierr in {10,14} <==> bgrat() error code ierr-10 in 1:4; for 1 and 4, warned *there*
    if (ierr.val && ierr.val !== 11 && ierr.val !== 14)
        printer_pbeta_raw('pbeta_raw(%d, a=%d, b=%d, ..) -> bratio() gave error code %d', x, a, b, ierr);
    if (log_p) {
        w.val = Math.log(w.val);
        wc.val = Math.log(wc.val);
    }
    return lower_tail ? w.val : wc.val;
} /* pbeta_raw() */

const printer_pbeta = debug('pbeta');

export function pbeta(q: number, a: number, b: number, lowerTail = true, logP = false): number {
    printer_pbeta('pbeta(q=%d, a=%d, b=%d, l.t=%s, ln=%s)', q, a, b, lowerTail, logP);
    if (isNaN(q) || isNaN(a) || isNaN(b)) return NaN;

    if (a < 0 || b < 0) return ML_ERR_return_NAN(printer_pbeta);
    // allowing a==0 and b==0  <==> treat as one- or two-point mass

    if (q <= 0) return R_DT_0(lowerTail, logP);
    if (q >= 1) return R_DT_1(lowerTail, logP);

    return pbeta_raw(q, a, b, lowerTail, logP);
}
