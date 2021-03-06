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
import { chebyshev_eval } from '$chebyshev';
import { ME, ML_ERR_return_NAN, ML_ERROR } from '@common/logger';
const printer = debug('lgammacor');

const algmcs: number[] = [
    +0.1666389480451863247205729650822,
    -0.1384948176067563840732986059135e-4,
    +0.9810825646924729426157171547487e-8,
    -0.1809129475572494194263306266719e-10,
    +0.6221098041892605227126015543416e-13,
    -0.3399615005417721944303330599666e-15,
    +0.2683181998482698748957538846666e-17,
    -0.2868042435334643284144622399999e-19,
    +0.3962837061046434803679306666666e-21,
    -0.6831888753985766870111999999999e-23,
    +0.1429227355942498147573333333333e-24,
    -0.3547598158101070547199999999999e-26,
    +0.1025680058010470912e-27,
    -0.3401102254316748799999999999999e-29,
    +0.1276642195630062933333333333333e-30,
];

const nalgm = 5;
const xbig = 94906265.62425156;
const xmax = 3.745194030963158e306;

export function lgammacor(x: number): number {
    let tmp: number;

    // For IEEE double precision DBL_EPSILON = 2^-52 = 2.220446049250313e-16 :
    //   xbig = 2 ^ 26.5
    //   xmax = DBL_MAX / 48 =  2^1020 / 3

    if (x < 10) return ML_ERR_return_NAN(printer);
    else if (x >= xmax) {
        ML_ERROR(ME.ME_UNDERFLOW, 'lgammacor', printer);
        // allow to underflow below
    } else if (x < xbig) {
        tmp = 10 / x;
        return chebyshev_eval(tmp * tmp * 2 - 1, algmcs, nalgm) / x;
    }
    return 1 / (x * 12);
}
