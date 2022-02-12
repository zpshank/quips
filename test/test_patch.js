import {next_record, write_record} from '../src/patch.js'
import {assert, TestSet} from './utils.js'
import * as c from '../src/const.js'
import * as std from 'std'

/*
 * Offset: 66051
 * Size: 1
 * Data: [42]
 */
const RECORD_A = Uint8Array.from([0x01, 0x02, 0x03, 0x00, 0x01, 0x2A]);
/*
 * Offset: 1
 * Size: 2
 * Data: [3, 4]
 */
const RECORD_B = Uint8Array.from([0x00, 0x00, 0x01, 0x00, 0x02, 0x03, 0x04]);
/*
 * Offset: 3
 * Size: 5
 * Is RLE: True
 * Data: [42]
 */
const RECORD_RLE = Uint8Array.from([0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x05, 0x2A]);
const EOF = Uint8Array.from([0x45, 0x4F, 0x46]);

const SEQUENCE = Uint8Array.from([0x01, 0x02, 0x03, 0x04, 0x05]);

let tests = new TestSet("PatchTests");

tests.beforeEach(function createFile() {
	this.file = std.tmpfile();
});

tests.afterEach(function closeFile() {
	this.file.close();
});

tests.add(function next_record_InvalidHeader() {
	this.file.puts("GARBAGE");
	this.file.seek(0, std.SEEK_SET);
	assert.throws(function() {
		next_record(this.file);
	}, this);
});

tests.add(function next_record_BeginFile() {
	this.file.write(c.PATCH.buffer, 0, c.PATCH.length);
	this.file.write(RECORD_A.buffer, 0, RECORD_A.length);
	this.file.write(EOF.buffer, 0, EOF.length);
	this.file.seek(0, std.SEEK_SET);

	let record = next_record(this.file);
	assert.equals(66051, record.offset);
	assert.equals(1, record.size);
	assert.equals(1, record.data.length);
	assert.equals(42, record.data[0]);
});

tests.add(function next_record_MiddleFile() {
	this.file.write(c.PATCH.buffer, 0, c.PATCH.length);
	this.file.write(RECORD_A.buffer, 0, RECORD_A.length);
	this.file.write(RECORD_B.buffer, 0, RECORD_B.length);
	this.file.write(EOF.buffer, 0, EOF.length);
	this.file.seek(11, std.SEEK_SET);

	let record = next_record(this.file);
	assert.equals(1, record.offset);
	assert.equals(2, record.size);
	assert.equals(2, record.data.length);
	assert.equals(3, record.data[0]);
	assert.equals(4, record.data[1]);
});

tests.add(function next_record_IsRle() {
	this.file.write(c.PATCH.buffer, 0, c.PATCH.length);
	this.file.write(RECORD_RLE.buffer, 0, RECORD_RLE.length);
	this.file.write(EOF.buffer, 0, EOF.length);
	this.file.seek(0, std.SEEK_SET);

	let record = next_record(this.file);
	assert.true(record.is_rle);
	assert.equals(3, record.offset);
	assert.equals(5, record.size);
	assert.equals(1, record.data.length);
	assert.equals(42, record.data[0]);
});

tests.add(function next_record_EOF() {
	this.file.write(c.PATCH.buffer, 0, c.PATCH.length);
	this.file.write(RECORD_A.buffer, 0, RECORD_A.length);
	this.file.write(EOF.buffer, 0, EOF.length);
	this.file.seek(11, std.SEEK_SET);

	let record = next_record(this.file);
	assert.true(record === undefined);
});

tests.add(function write_record_StandardBegin() {
	this.file.write(SEQUENCE.buffer, 0, SEQUENCE.length);
	this.file.seek(0, std.SEEK_SET);

	let data = Uint8Array.from([0x42, 0x43]);
	let record = {
		is_rle: false,
		offset: 1,
		size: 2,
		data: data
	}

	write_record(this.file, record);

	this.file.seek(0, std.SEEK_SET);
	let bytes = [0x01, 0x42, 0x43, 0x04, 0x05];
	for (let expected of bytes) {
		assert.equals(expected, this.file.getByte());
	}
});

tests.add(function write_record_StandardMiddle() {
	this.file.write(SEQUENCE.buffer, 0, SEQUENCE.length);
	this.file.seek(2, std.SEEK_SET);

	let data = Uint8Array.from([0x42, 0x43]);
	let record = {
		is_rle: false,
		offset: 1,
		size: 2,
		data: data
	}

	write_record(this.file, record);

	this.file.seek(0, std.SEEK_SET);
	let bytes = [0x01, 0x42, 0x43, 0x04, 0x05];
	for (let expected of bytes) {
		assert.equals(expected, this.file.getByte());
	}
});

tests.add(function write_record_Rle() {
	this.file.write(SEQUENCE.buffer, 0, SEQUENCE.length);
	this.file.seek(0, std.SEEK_SET);

	let data = Uint8Array.from([0x42]);
	let record = {
		is_rle: true,
		offset: 2,
		size: 3,
		data: data
	}

	write_record(this.file, record);

	this.file.seek(0, std.SEEK_SET);
	let bytes = [0x01, 0x02, 0x42, 0x042, 0x42];
	for (let expected of bytes) {
		assert.equals(expected, this.file.getByte());
	}
});

std.exit(tests.run());
