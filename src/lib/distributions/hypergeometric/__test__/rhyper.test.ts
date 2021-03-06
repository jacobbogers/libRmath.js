//helper
//import { emptyFloat32Array } from '$constants';
import '$jest-extension';
import '$mock-of-debug';// for the side effects
import { IRNGNormalTypeEnum } from '@rng/normal/in01-type';
import { globalUni, RNGKind } from '@rng/globalRNG';
import { IRNGTypeEnum } from '@rng/irng-type';
import { rhyper } from '..';
//import { loadData } from '$test-helpers/load';
//import { resolve } from 'path';

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

const rhyperLogs = select('rhyper');
const rhyperDomainWarns = rhyperLogs("argument out of domain in '%s'");
//const rhyperWarns = select('R_Q_P01_check')("argument out of domain in '%s'");



describe('rhyper', function () {
    xdescribe('invalid input', () => {
        beforeEach(() => {
            cl.clear('rhyper');
        });
        it('n=1, other params are NaNs or Infinity',async  () => {
            const nan2 = rhyper(1, NaN, 0, 0);
            const nan3 = rhyper(1, 0, NaN, 0);
            const nan4 = rhyper(1, 0, 0, Infinity);
            expect([nan2[0], nan3[0], nan4[0]]).toEqualFloatingPointBinary(NaN);
            expect(rhyperDomainWarns()).toHaveLength(3);
        });
        it('test inputs nr < 0, nb <0, n <0 n > (nb+nr)', async () => {
            const nan1 = rhyper(1, -1, 0, 0);
            const nan2 = rhyper(1, 0, -1, 0);
            const nan3 = rhyper(1, 0, 0, -1);
            const nan4 = rhyper(1, 0, 0, 2);
            expect([nan1[0], nan2[0], nan3[0], nan4[0]]).toEqualFloatingPointBinary(NaN);
            expect(rhyperDomainWarns()).toHaveLength(4);
        });
    });

    describe('edge cases', () => {
        it('test with m, n, k bigger then INT_MAX (2^31-1)', async () => {

            await new Promise(resolve => {
                setTimeout(resolve, 3000);
            });
            RNGKind(IRNGTypeEnum.MERSENNE_TWISTER, IRNGNormalTypeEnum.INVERSION);
            globalUni().init(1234);
            //const z = rhyper(10,2**31,2**31,1)
            //expect(z).toEqualFloatingPointBinary([0, 1, 1, 1, 1, 1, 0, 0, 1, 1]);
            //const z2 = rhyper(10,2**31-2,2**31,1)
            //expect(z2).toEqualFloatingPointBinary([ 1, 1, 0, 1, 0, 1, 0, 0, 0, 0]);
            globalUni().init(1234);
            const d = Date.now();
            const z3 = rhyper(
                1,
                2**31-1,
                2**31-1,
                2**31-1,
                undefined,
                false
            );
            const delay = Date.now()-d;
            console.log(`r=${z3}, delay=${delay}ms`);
            /*for (let i=0; i < 0.5*2**31-1;i++){
                Math.log(i);
                Math.exp(-i)
            }
           /* expect(z3).toEqualFloatingPointBinary([
                500603, 499844, 499861, 499843, 499458, 499820, 501173, 500365, 499785, 499982
            ]);*/
        });
    });

    xdescribe('with fixtures', () => {
        beforeAll(()=>{
            RNGKind(IRNGTypeEnum.MERSENNE_TWISTER, IRNGNormalTypeEnum.INVERSION);
            globalUni().init(12345);
        });
        xit('n=100', async () => {
            //rhyper(1, 23,45,10);
            //consorhyper(10,23,45,10));
            rhyper(100,2**31-2,2**31-2,2**31-2)
            console.log(rhyper(1,2**31-2,2**31-2,2**31-1));
        });
        xit('n=100', async () => {
            //rhyper(1, 23,45,10);
            //consorhyper(10,23,45,10));
            rhyper(100,2**31-2,2**31-2,1E6)
            console.log(rhyper(1,2**31-2,2**31-2,1E6));
        });
    });
});