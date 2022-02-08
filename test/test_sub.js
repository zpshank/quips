import sub from '../src/sub.js'
import {assert, TestSet} from './utils.js'
import {exit} from 'std'

let tests = new TestSet("SubTests");

tests.add(function testZero() {
	assert.equals(0, sub(0, 0))
});

tests.add(function testPositive() {
	assert.equals(-1, sub(0, 1));
});

tests.add(function testNegative() {
	assert.equals(1, sub(0, -1));
});

exit(tests.run());

