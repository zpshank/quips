import * as c from './const.js'
import * as std from 'std'

function validate_header(fd) {
	let bytes = new Uint8Array(5);

	fd.read(bytes.buffer, 0, bytes.length);

	let bytesMatch = function (val, i) {
		return val === c.PATCH[i];
	}

	if (!bytes.every(bytesMatch)) {
		throw "Invalid header: " + bytes
	}
}

export function next_record(fd) {
	if (fd.tell() == 0) {
		validate_header(fd);
	}

	// Read offset
	let bytes = new Uint8Array(3);
	fd.read(bytes.buffer, 0, bytes.length);
	let offset = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];

	// Read patch size
	bytes = new Uint8Array(2);
	fd.read(bytes.buffer, 0, bytes.length);
	let size = (bytes[0] << 8) | bytes[1];

	// Check EOF
	if (fd.eof()) {
		return undefined;
	}

	// Check if RLE record
	let is_rle = false;
	if (size == 0) {
		is_rle = true;

		// Next two bytes are the rle size
		bytes = new Uint8Array(2);
		fd.read(bytes.buffer, 0, bytes.length);
		size = (bytes[0] << 8) | bytes[1];

		// Next byte is the data
		bytes = new Uint8Array(1);
		fd.read(bytes.buffer, 0, bytes.length);
	} else {
		// Read data
		bytes = new Uint8Array(size);
		fd.read(bytes.buffer, 0, bytes.length);
	}


	return {
		offset: offset,
		size: size,
		data: bytes,
		is_rle: is_rle
	};
}

export function write_record(fd, record) {
	let seek = record.offset - fd.tell();
	fd.seek(seek, std.SEEK_CUR);

	if (record.is_rle) {
		for (let i = 0; i < record.size; i++) {
			fd.write(record.data.buffer, 0, record.data.length);
		}
	} else {
		fd.write(record.data.buffer, 0, record.data.length);
	}
}
