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
const generate_subtitles = require('./utils/generate_subtitles.js')
const input = cli.input;
const flags = cli.flags;
const { clear } = flags;

(async () => {
	init({ clear });
	// input.includes(`help`) && cli.showHelp(0);

	flags.name && flags.software && flags.destination && (
		await generate_subtitles(flags.name, flags.software, flags.destination)

	)
})();
