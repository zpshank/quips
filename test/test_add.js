import add from '../src/add.js'
import {assert, TestSet} from './utils.js'
import {exit} from 'std'

let tests = new TestSet("AddTests");

tests.add(function testZero() {
	assert.equals(0, add(0, 0))
});

tests.add(function testPositive() {
	assert.equals(1, add(0, 1));
});

tests.add(function testNegative() {
	assert.equals(-1, add(0, -1));
});

exit(tests.run());

