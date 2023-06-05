#!/usr/bin/env node

/**
 * srt2subtitles
 * Generate editable video subtitles in Final Cut Pro/Premiere Pro from a SRT file.
 *
 * @author Sherry Wang <https://github.com/shaishaicookie>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const fcpxml = require('./utils/fcpxml')
const input = cli.input;
// const flags = cli.flags;
// const { clear } = flags;

// const process = require('process')

(async () => {
	// init({ clear });
	let [srt_path, fps, destination_path] = cli.input

	if (!srt_path) {
		console.error('Specify a SRT file')
		process.exit(1)
	}

	if (srt_path && !srt_path.endsWith('.srt')) {
		console.error('Enter correct SRT file')
		process.exit(1)
	}

	if (!fps) {
		console.error('Specify frame rate ')
		process.exit(1)
	}

	if (fps && !parseFloat(fps)) {
		console.error('Enter correct fps number')
		process.ext(1)
	}

	if (srt_path && !srt_path.endsWith('.srt') && fps && !parseFloat(fps)) {
		console.error('Enter correct SRT file')
		console.error('Enter correct fps number')
		process.exit(1)
	}

	if (!destination_path) {
		destination_path = process.cwd()
	}

	
	console.log(srt_path, fps, destination_path)

	fcpxml(srt_path, fps, destination_path)

})();
