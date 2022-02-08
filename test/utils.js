import {printf} from 'std'

export const assert = {
	equals: function(expected, actual) {
		if (expected !== actual) {
			throw "Expected " + expected + " but was " + actual;
		}
	}
};

export const TestSet = function(name) {
	this.name = name;
	this.tests = [];
}

TestSet.prototype.add = function(testFn) {
	this.tests.push(testFn);
}

TestSet.prototype.run = function() {
	let failures = 0;
	for (let test of this.tests) {
		try {
			test.call();
			printf("[%s][%s]: SUCCESS\n", this.name, test.name);
		} catch(err) {
			printf("[%s][%s]: FAILURE %s\n", this.name, test.name, err);
			failures++;
		}
	}
	return failures;
};

