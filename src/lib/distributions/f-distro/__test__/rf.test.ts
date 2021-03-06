//helper
import '$jest-extension';
import '$mock-of-debug';// for the side effects
import { rf } from '..';
import { IRNGTypeEnum } from '@rng/irng-type';
import { globalUni, RNGKind } from '@rng/globalRNG';
import { IRNGNormalTypeEnum } from '@rng/normal/in01-type';

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

const rfLogs = select('rf');
const rfDomainWarns = rfLogs("argument out of domain in '%s'");

describe('rf', function () {
    beforeEach(() => {
        RNGKind(IRNGTypeEnum.MERSENNE_TWISTER, IRNGNormalTypeEnum.INVERSION);
        cl.clear('rf');
        globalUni().init(123456);
    })
    it('n=10, df1=3, df2=55', () => {
        const actual = rf(10, 3, 55);
        expect(actual).toEqualFloatingPointBinary([
            //R fixture
            1.438532335883850877, 0.152292764263807473, 1.075127709839280410,
            2.781127780111504411, 0.561680549960085540, 0.518936008539955584,
            0.208490827724434752, 0.054437343138592373, 0.293260799311292508,
            0.745925571590343450
        ]);
    });
    it('n=1, df1=-3(<0), df2=55', () => {
        const nan = rf(1, -3, 55);
        expect(nan).toEqualFloatingPointBinary(NaN);
        expect(rfDomainWarns()).toHaveLength(1);
    });
    it('n=1, df1=Inf, df2=Inf', () => {
        const z = rf(1, Infinity, Infinity);
        expect(z).toEqualFloatingPointBinary(1);
    });
});