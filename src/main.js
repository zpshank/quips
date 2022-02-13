import * as std from 'std'
import * as patch from './patch.js'
import Config from './config.js'

const usage = 
	'Usage:' + scriptArgs[0] + ' [options] [input_file]\n' +
	'-h --help     list options\n' +
	'-o --output   creates a new file instead of modifying input_file\n' +
	'-p --patch    patch file to apply\n' +
	'-y --yes      answers yes to overwrite file question\n';

const c = new Config(scriptArgs);

if (c.help) {
	print(usage);
	std.exit(0);
}

if (!c.input) {
	print('Missing input_file');
	print(usage);
	std.exit(1);
}

if (!c.patch) {
	print('Missing patch file');
	print(usage);
}

if (!c.output && !c.yes) {
	// Instructed to overwrite input file. Add overwrite confirmation.
	std.printf('Are you sure you want to overwrite %s? [Y|N] (Default:N) ', c.input);
	let resp = std.in.getline();
	if (resp.toUpperCase().trim() != 'Y') {
		std.exit(0);
	}
}

let input_fd = std.open(c.input, 'r+');
if (c.output) {
	var output_fd = std.open(c.output, 'w');
	// Copy input_file to output
	let b = input_fd.getByte();
	while (b != -1) {
		output_fd.putByte(b);
		b = input_fd.getByte();
	}
	output_fd.seek(0, std.SEEK_SET);
} else {
	var output_fd = input_fd;
}

let patch_fd = std.open(c.patch, 'r');
let record = patch.next_record(patch_fd);
while (record) {
	patch.write_record(output_fd, record);
	record = patch.next_record(patch_fd);
}
