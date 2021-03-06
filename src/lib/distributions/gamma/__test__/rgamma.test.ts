//helper
import { emptyFloat64Array } from '$constants';
import '$jest-extension';
import '$mock-of-debug';// for the side effects
import { IRNGNormalTypeEnum } from '@rng/normal/in01-type';
import { globalUni, RNGKind } from '@rng/globalRNG';
import { IRNGTypeEnum } from '@rng/irng-type';
import { rgamma } from '..';
import { loadData } from '$test-helpers/load';
import { resolve } from 'path';

const cl = require('debug');

function select(ns: string) {
    return function (filter: string) {
        return function () {
            const logs = cl.get(ns);// put it here and not in the function scope
            if (!logs) return [];
            return logs.filter((s: string[]) => s[0] === filter);
        };
    };
}

const rgammaLogs = select('rgammaOne');
const rgammaDomainWarns = rgammaLogs("argument out of domain in '%s'");
//const bounderiesWarns = select('R_Q_P01_boundaries')("argument out of domain in '%s'");

describe('rgamma', function () {
    describe('invalid input', () => {
        beforeEach(() => {
            cl.clear('rgammaOne');
            cl.clear('R_Q_P01_boundaries');
        });
        it('n=-1(<0)', () => {
            expect(() => rgamma(-1, 1.6)).toThrow();
        });
        it('n=1, scale=NaN  shape=4', () => {
            const nan = rgamma(1, 4, undefined, NaN);
            expect(nan).toEqualFloatingPointBinary(NaN);
            expect(rgammaDomainWarns()).toHaveLength(1);
        });
    });
    describe('edge cases', () => {
        it('n=0, shape=1.6, defaults', () => {
            const z = rgamma(0, 1.6);
            expect(z).toBe(emptyFloat64Array);
        });
        it('n=1, scale=0, shape=4', () => {
            const z = rgamma(1, 4, undefined, 0);
            expect(z).toEqualFloatingPointBinary(0);
        });
        it('n=1, scale=3, shape=0', () => {
            const z = rgamma(1, 0, 1 / 3);
            expect(z).toEqualFloatingPointBinary(0);
        });
    });
    describe('fidelity, Mersenne-Twister & Inversion', () => {
        beforeEach(() => {
            RNGKind(IRNGTypeEnum.MERSENNE_TWISTER, IRNGNormalTypeEnum.INVERSION);
        });
        it('n=100, shape=1, scale=3', async () => {
            const [y] = await loadData(
                resolve(__dirname, 'fixture-generation', 'rgamma1.R'),
                /\s+/,
                1
            );
            globalUni().init(12345);
            const a = rgamma(100, 1, 1 / 3);
            expect(a).toEqualFloatingPointBinary(y);
        });
        it('n=100, shape=0.2 (<1), scale=3', async () => {
            const [y] = await loadData(
                resolve(__dirname, 'fixture-generation', 'rgamma2.R'),
                /\s+/,
                1
            );
            globalUni().init(12345);
            const a = rgamma(100, 0.2, 1 / 3);
            expect(a).toEqualFloatingPointBinary(y, 45);
        });
        it('n=100, shape=2.5 (1< shape <3.68), scale=3', async () => {
            const [y] = await loadData(
                resolve(__dirname, 'fixture-generation', 'rgamma3.R'),
                /\s+/,
                1
            );
            globalUni().init(12345);
            const z = rgamma(100, 2.5, 1 / 3);
            expect(z).toEqualFloatingPointBinary(y);
        });
        it('n=100, shape=2.5 (3.68 < shape < 13.022), scale=3', async () => {
            const [y] = await loadData(
                resolve(__dirname, 'fixture-generation', 'rgamma4.R'),
                /\s+/,
                1
            );
            globalUni().init(12345);
            const z = rgamma(100, 12.5, 1 / 3);
            expect(z).toEqualFloatingPointBinary(y);
        });
        it('n=10, shape=34, ', () => {
            globalUni().init(12345);
            const act = rgamma(10, 34);
            expect(act).toEqualFloatingPointBinary([
                // data from R
                36.974704047753420
                , 37.732166960881386
                , 32.870348131808953
                , 33.633973783507038
                , 48.249875084583067
                , 38.454673772074443
                , 31.875493264905938
                , 43.804482844669913
                , 30.952189091954800
                , 35.679505107580880
            ]);
        });
    });
});