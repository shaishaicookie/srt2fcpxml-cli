#!/usr/bin/env node

/**
 * srt2subtitles
 * Generate editable video subtitles in Final Cut Pro/Premiere Pro from a SRT file.
 *
 * @author Sherry Wang <https://github.com/shaishaicookie>
 */

import fcpxml from './utils/fcpxml.js'
// import cli from './utils/cli.js';
import meow from 'meow'
import ora from 'ora'
import path from 'node:path'
import fs from 'node:fs'

const cli = meow(`
	Usage
	  $ s2s <srt> <fps> [destination]
	  $ srt2subtitles <srt> <fps> [destination]

	Examples
	  $ s2s TheImitationGame.srt 30
	  $ s2s TheImitationGame.srt 30 ./subtitles/
`, {});

const input = cli.input;
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
	console.error('Specify frame rate')
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

const spinner = ora('Creating editable subtitles XML files').start();


try {
  fcpxml(srt_path, fps, destination_path)
  const project_name = path.parse(srt_path).name
  // check fcpxml file
  const fcpxml_path = path.join(destination_path, `${project_name}.fcpxml`)
  const has_fcpxml = fs.existsSync(fcpxml_path)
  if (has_fcpxml) {
	spinner.succeed(`Created ${project_name}.fcpxml`)
	} else {
	spinner.fail('An error occurred during fcpxml generation, Please check your SRT format is correct');
	}
} catch (error) {
  spinner.fail('An error occurred during fcpxml generation, Please check your SRT format is correct');
}




