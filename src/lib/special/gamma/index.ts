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

export { gammafn as gamma, _gammafn as gammaOne } from './gamma_fn';
export { digamma, pentagamma, psigamma, tetragamma, trigamma } from './polygamma';
export { lgammafn_sign as lgammaOne, lgammafn as lgamma } from './lgammafn_sign';
export type { NumArray } from '$constants';
