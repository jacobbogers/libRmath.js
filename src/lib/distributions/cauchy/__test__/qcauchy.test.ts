//helper
import '$jest-extension';
import { loadData } from '$test-helpers/load';
import { resolve } from 'path';

import { qcauchy } from '..';

jest.mock('@common/logger', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('@common/logger');
    const { ML_ERROR, ML_ERR_return_NAN } = originalModule;
    let array: unknown[];
    function pr(...args: unknown[]): void {
        array.push([...args]);
    }

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        ML_ERROR: jest.fn((x: unknown, s: unknown) => ML_ERROR(x, s, pr)),
        ML_ERR_return_NAN: jest.fn(() => ML_ERR_return_NAN(pr)),
        setDestination(arr: unknown[] = []) {
            array = arr;
        },
        getDestination() {
            return array;
        }
    };
});
//app
const cl = require('@common/logger');
cl.setDestination();
const out = cl.getDestination();

describe('qcauchy', function () {

    beforeEach(() => {
        out.splice(0);//clear out
    })
    it('ranges p ∊ [0, 1, step 0.02] defaults', async () => {
        const [x, y] = await loadData(resolve(__dirname, 'fixture-generation', 'qcauchy.R'), /\s+/, 1, 2);
        const actual = x.map(_x => qcauchy(_x));
        expect(actual).toEqualFloatingPointBinary(y, 47);
    });
    it('p=NaN, defaults', () => {
        const z = qcauchy(NaN);
        expect(z).toBeNaN();
    });
    it('p=-1, defaults', () => {
        const nan = qcauchy(-1);
        expect(nan).toBeNaN();
    });
    it('p=1 or -1, defaults', () => {
        const z = qcauchy(1);
        expect(z).toBe(Infinity);
        const z1 = qcauchy(0);
        expect(z1).toBe(-Infinity);
        // lower tail = false
        const z2 = qcauchy(1, undefined, undefined, false);
        expect(z2).toBe(-Infinity);
        const z3 = qcauchy(0, undefined, undefined, false);
        expect(z3).toBe(Infinity);
    });
    it('p=0.66, scale=-1(<0), defaults', () => {
        const nan = qcauchy(0.66, undefined, -1);
        expect(nan).toBeNaN();
        expect(out.length).toBe(1);
    });
    it('p=0.66, scale=0, defaults', () => {
        const nan = qcauchy(0.66, undefined, 0);
        expect(nan).toBe(0);
    });
    it('p=-0.66, log=true, defaults', () => {
        const z = qcauchy(-0.66, undefined, undefined,undefined, true);
        expect(z).toEqualFloatingPointBinary(0.052989541547587254);
    });
    it('p=-1.66, log=true, defaults', () => {
        const z = qcauchy(-1.66, undefined, undefined,undefined, true);
        expect(z).toEqualFloatingPointBinary(-1.4700742254066812, 50);
    });
    it('p=0, log=true, defaults', () => {
        const z = qcauchy(0, undefined, undefined,undefined, true);
        expect(z).toBe(Infinity);
    });
});