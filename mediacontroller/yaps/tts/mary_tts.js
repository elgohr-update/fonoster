/**
 * @author Pedro Sanders
 * @since v1
 */
const AbstractTTS = require('./abstract_tts')
const http = require('http')
const fs = require('fs')
const deasync = require('deasync')
const {
    computeFilename
} = require('./utils')

class MaryTTS extends AbstractTTS {

    // Config not yet implemnted
    constructor(config) {
        super('mary-tts')
        const options = `INPUT_TYPE=TEXT&AUDIO=WAVE_FILE&OUTPUT_TYPE=AUDIO&LOCALE=EN_US`
        if (process.env.TTS_ENGINE_HOST && process.env.TTS_ENGINE_HOST) {
            this.serviceUrl
              = `http://${process.env.TTS_ENGINE_HOST}:${process.env.TTS_ENGINE_PORT}/process?${options}`
        } else {
            // Here only for testing
            this.serviceUrl
              = `http://127.0.0.1:59125/process?${options}`
        }
    }

    // Options not yet implemnted
    synthesizeSync(text, options) {
        const tmpDirFromEnv = process.env.MC_TTS_TEMP_FOLDER
        const tmpDir = tmpDirFromEnv ? tmpDirFromEnv : __dirname
        const pathToFile = tmpDir + '/' + computeFilename(text, options)
        let complete
        const file = fs.createWriteStream(pathToFile)
        const request = http.get(`${this.serviceUrl}&INPUT_TEXT=${encodeURI(text)}`, response => {
            response.pipe(file)
            complete = true
        });

        while(complete === undefined) require('deasync').sleep(100)

        return pathToFile
    }
}

module.exports = MaryTTS