import Config from '../src/config.js'
import {assert, TestSet} from './utils.js'
import * as std from 'std'

let tests = new TestSet("ConfigTests");

tests.add(function constructor() {
	let c = new Config();

	assert.true(c.output === undefined);
	assert.true(c.input === undefined);
	assert.true(c.patch === undefined);
	assert.false(c.yes);
	assert.false(c.help);
});

tests.add(function test_shorthand() {
	const args = ['script', '-o', 'output_file', '-p', 'patch_file', '-y', '-h', 'input_file']
	const c = new Config(args);

	assert.equals('output_file', c.output);
	assert.equals('input_file', c.input);
	assert.equals('patch_file', c.patch);
	assert.true(c.yes);
	assert.true(c.help);
});

tests.add(function test_longhand() {
	const args = ['script', '-output', 'output_file', '-patch', 'patch_file', '-yes', '-help', 'input_file']
	const c = new Config(args);

	assert.equals('output_file', c.output);
	assert.equals('input_file', c.input);
	assert.equals('patch_file', c.patch);
	assert.true(c.yes);
	assert.true(c.help);
});

tests.add(function test_equals() {
	const args = ['script', '-output=output_file', '-p=patch_file', '-y', '-h', 'input_file']
	const c = new Config(args);

	assert.equals('output_file', c.output);
	assert.equals('input_file', c.input);
	assert.equals('patch_file', c.patch);
	assert.true(c.yes);
	assert.true(c.help);
});

tests.add(function test_unknown_option() {
	const args = ['script', '-unknown', 'input_file'];
	assert.throws(function parse() {
		const c = new Config(args);
	}, this);
});

tests.add(function test_only_help() {
	const args = ['script', '--help'];
	const c = new Config(args);

	assert.true(c.help);
});

std.exit(tests.run());
