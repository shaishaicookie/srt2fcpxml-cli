const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	// debug: {
	// 	type: `boolean`,
	// 	default: false,
	// 	alias: `d`,
	// 	desc: `Print debug info`
	// },
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},

	name: {
		type: 'string',
		alias: 'n',
		desc: 'SRT file name'
	},

	software: {
		type: 'string',
		alias: 's',
		default: 'fcpx',
		desc: 'Which editing software ? [fcpx|premiere]'
	},

	destination: {
		type: 'string',
		default: './',
		alias: 'd',
		desc: 'Ouput XML path'
	}


};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `srt2subtitles`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
