//helper
import '$jest-extension';
import '$mock-of-debug';// for the side effects
import { loadData } from '$test-helpers/load';
import { resolve } from 'path';
import { pexp } from '..';

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

const dexpLogs = select('pexp');
const dexpDomainWarns = dexpLogs("argument out of domain in '%s'");

describe('pexp', function () {
    beforeEach(() => {
        cl.clear('pexp');
    })
    it('x=[-0.5, 3], rates= 1, 2, 16, (5 and tail=F)', async () => {
        const [p, y1, y2, y3, y4] = await loadData(resolve(__dirname, 'fixture-generation', 'pexp.R'), /\s+/, 1, 2, 3, 4, 5);

        const a1 = p.map(_p => pexp(_p, 1));
        expect(a1).toEqualFloatingPointBinary(y1, 49);

        const a2 = p.map(_p => pexp(_p, 2));
        expect(a2).toEqualFloatingPointBinary(y2, 49);

        const a3 = p.map(_p => pexp(_p, 16));
        expect(a3).toEqualFloatingPointBinary(y3, 50);

        const a4 = p.map(_p => pexp(_p, 5, false));
        expect(a4).toEqualFloatingPointBinary(y4, 50);
    });
    
    it('rate = NaN', () => {
        const nan = pexp(0, NaN);
        expect(nan).toBeNaN();
    });
    it('rate = -3 (<0)', () => {
        const nan = pexp(0, -3);
        expect(nan).toBeNaN();
        expect(dexpDomainWarns()).toHaveLength(1);
    });
    it('asLog = true, rate = 5, x=2', () => {
        const z = pexp(2, 5, undefined, true);
        expect(z).toEqualFloatingPointBinary(-4.5400960370489214e-05, 51);
    });
    it('defaults', () => {
        const z = pexp(2);
        expect(z).toEqualFloatingPointBinary( 0.8646647167633873);
    });
});