
const short_hand = {
	o: 'output',
	p: 'patch',
	y: 'yes',
	h: 'help'
};

function parse_args(config, args) {
	if (args.length == 0) {
		return;
	}

	// Last argument, must be input file
	if (args.length == 1) {
		config.input = args[0];
		return;
	}

	// Parse argument and value
	let arg = args[0]
		.replace(/^-+/, '')
		.split('=');
	let option = arg[0];
	let value = arg[1];

	// Check short hand
	if (!Object.values(short_hand).includes(option)) {
		option = short_hand[option];
	}

	// Check for unknown option
	if (!option) {
		throw "Unknown option " + arg;
	}
	
	let slice_index = 1;
	if (option == 'yes' || option == 'help') {
		value = true;
		slice_index = 1;
	}
	// No value yet, must be next arg
	if (!value) {
		value = args[1];
		slice_index = 2;
	}
	config[option] = value;
	parse_args(config, args.slice(slice_index));
}

/**
 * Output File: output
 * Input File: input
 * Patch File: patch
 * Yes: yes
 * Help: help
 */
const Config = function(scriptArgs) {
	let args = scriptArgs || [];

	this.yes = false;
	this.help = false;

	if (args.length > 0) {
		// First argument is always the script name itself. Ignore that
		parse_args(this, args.slice(1));
	}
}

export default Config;
