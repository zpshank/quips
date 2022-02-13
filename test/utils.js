import {printf} from 'std'

export const assert = {
	equals: function(expected, actual) {
		if (expected !== actual) {
			throw "Expected " + expected + " but was " + actual;
		}
	},
	true: function(stmt) {
		if (typeof(stmt) !== 'boolean') {
			throw "Expected boolean statement";
		}
		if (stmt === false) {
			throw "Expected true";
		}
	},
	false: function(stmt) {
		if (typeof(stmt) !== 'boolean') {
			throw "Expected boolean statement";
		}
		if(stmt === true) {
			throw "Expected false";
		}
	},
	throws: function(fn, thisArg) {
		try {
			fn.call(thisArg);
		} catch (err) {
			return;
		}
		throw "Expected to throw error."
	}
};

export const TestSet = function(name) {
	this.name = name;
	this.tests = [];
}

TestSet.prototype.add = function(testFn) {
	this.tests.push(testFn);
}

TestSet.prototype.beforeAll = function(beforeAllFn) {
	this.beforeAllFn = beforeAllFn;
}

TestSet.prototype.beforeEach = function(beforeEachFn) {
	this.beforeEachFn = beforeEachFn;
}

TestSet.prototype.afterEach = function(afterEachFn) {
	this.afterEachFn = afterEachFn;
}

TestSet.prototype.afterAll = function(afterAllFn) {
	this.afterAllFn = afterAllFn;
}

TestSet.prototype.run = function() {
	if (this.beforeAllFn) {
		this.beforeAllFn.call(this);
	}
	let failures = 0;
	for (let test of this.tests) {
		if (this.beforeEachFn) {
			this.beforeEachFn.call(this);
		}
		try {
			test.call(this);
			printf("[%s][%s]: SUCCESS\n", this.name, test.name);
		} catch(err) {
			printf("[%s][%s]: FAILURE %s\n", this.name, test.name, err);
			failures++;
		}
		if (this.afterEachFn) {
			this.afterEachFn.call(this);
		}
	}
	if (this.afterAllFn) {
		this.afterAllFn.call(this);
	}
	return failures;
};
