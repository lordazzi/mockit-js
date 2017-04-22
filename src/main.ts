import { Calc } from './calc';

new class Main {
	public calc: Calc;

	construtor() {
		this.calc = new Calc();
		console.info(`Sum 1 and 1: ${this.calc.sum(1, 1)}`);
		console.info(`Subtract 1 of 2: ${this.calc.subtract(2, 1)}`);
		console.info(`Divide 4 by 2: ${this.calc.divide(4, 2)}`);
		console.info(`Multiply 2 by 2: ${this.calc.multiply(2, 2)}`);
	}
}
