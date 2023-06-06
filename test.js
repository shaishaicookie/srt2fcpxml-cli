import path from 'node:path'
import fs from 'node:fs'
import {fileURLToPath} from 'node:url';
import test from 'ava'
import {execa} from 'execa'
import {temporaryDirectory} from 'tempy'
import fcpxml from './utils/fcpxml.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


test('generateFcpxml should create fcpxml file', t => {
    const srtPath = 'TheImitationGame.srt'
    const fps = '25';
    const destinationPath = './'

    fcpxml(srtPath, fps, destinationPath)

    const fcpxmlPath = './TheImitationGame.fcpxml'
    t.true(fs.existsSync(fcpxmlPath), 'fcpxml file should be created')
  })

test('test fcpxml generation with float fps', t => {
    const srtPath = 'TheImitationGame.srt';
    const fps = '29.97';
    const destinationPath = './';

    fcpxml(srtPath, fps, destinationPath);
    const fcpxmlPath = './TheImitationGame.fcpxml';
    t.true(fs.existsSync(fcpxmlPath), 'fcpxml file should be created');
})

test('cli with basic input', async t => {
	try {
        await execa(path.join(__dirname, 'cli.js'), [path.join(__dirname, 'TheImitationGame.srt'), '30'])
	} catch (error) {
        throw error
	}

    t.true(fs.existsSync(path.join(__dirname, 'TheImitationGame.fcpxml')))

})


test('cli with destination input', async t => {
    const cwd = temporaryDirectory()
	try {
        await execa(path.join(__dirname, 'cli.js'), [path.join(__dirname, 'TheImitationGame.srt'), '25', cwd])
	} catch (error) {
        throw error
	}

    t.true(fs.existsSync(path.join(cwd, 'TheImitationGame.fcpxml')))

})
