import { Calc } from './calc';

describe('Testing Calc class', () => {
    const calc = new Calc();

    it('Sum', () => {
        expect(calc.sum(1, 1)).toBe(2);
    });

    it('Subtract', () => {
        expect(calc.subtract(2, 1)).toBe(1);
    });

    it('Divide', () => {
        expect(calc.divide(4, 2)).toBe(2);
    });

    it('Multiply', () => {
        expect(calc.multiply(2, 2)).toBe(4);
    });
});





