import { describe, it, expect, vi } from 'vitest'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { parseResults, AfterEffectsScriptError, NoResultError } from '../src/api/common'

// After Effects writes results via ExtendScript's toSource(), producing a
// javascript object literal — not JSON. These fixtures mirror that format.
function writeResultsFile(contents: string): string {
    const url = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-test-')), 'result.js')
    fs.writeFileSync(url, contents)
    return url
}

describe('parseResults', () => {

    it('returns null for a null resultUrl', () => {
        expect(parseResults(null, () => undefined)).toBeNull()
    })

    it('parses the toSource() module.exports format After Effects writes', () => {
        const url = writeResultsFile(
            'module.exports = ({error: null, logs: [], result: 42})'
        )

        const results = parseResults(url, () => undefined)
        expect(results).not.toBeNull()
        expect(results?.result).toBe(42)
    })

    it('forwards logs to the logger, one call per entry', () => {
        const url = writeResultsFile(
            'module.exports = ({error: null, logs: [["hello", 5], ["world"]], result: null})'
        )

        const logger = vi.fn()
        parseResults(url, logger)

        expect(logger).toHaveBeenCalledTimes(2)
        expect(logger).toHaveBeenNthCalledWith(1, 'hello', 5)
        expect(logger).toHaveBeenNthCalledWith(2, 'world')
    })

    it('throws AfterEffectsScriptError when the script reported an error', () => {
        const url = writeResultsFile(
            'module.exports = ({error: {message: "boom", stack: "", name: "Error"}, logs: [], result: null})'
        )

        expect(() => parseResults(url, () => undefined)).toThrow(AfterEffectsScriptError)
        expect(() => parseResults(url, () => undefined)).toThrow(/boom/)
    })

    it('throws NoResultError when the file is missing', () => {
        expect(() => parseResults('/nonexistent/result.js', () => undefined)).toThrow(NoResultError)
    })

    it('throws NoResultError when the file is not a results module', () => {
        const url = writeResultsFile('this is not javascript {{{')
        expect(() => parseResults(url, () => undefined)).toThrow(NoResultError)
    })

})
