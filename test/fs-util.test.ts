import { describe, it, expect } from 'vitest'

import fs from 'fs'
import os from 'os'
import path from 'path'

import {
    read,
    readSync,
    write,
    writeSync,
    tryUnlink,
    tryUnlinkSync,
    isAccessibleDir,
    isAccessibleDirSync,
    isAccessibleFile,
    isAccessibleFileSync,
    NodeJsWritePermissionError
} from '../src/util/fs-util'

function tmpFile(name: string): string {
    return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ae-fs-test-')), name)
}

describe('fs-util', () => {

    it('write / read round trip', async () => {
        const url = tmpFile('async.txt')
        await write(url, 'hello')
        expect(await read(url)).toBe('hello')
    })

    it('writeSync / readSync round trip', () => {
        const url = tmpFile('sync.txt')
        writeSync(url, 'hello')
        expect(readSync(url)).toBe('hello')
    })

    it('read failures throw the package error', async () => {
        expect(() => readSync(tmpFile('missing.txt'))).toThrow(NodeJsWritePermissionError)
        await expect(read(tmpFile('missing.txt'))).rejects.toThrow(NodeJsWritePermissionError)
    })

    it('tryUnlink reports success and failure without throwing', async () => {
        const url = tmpFile('unlink.txt')
        writeSync(url, 'x')

        expect(tryUnlinkSync(url)).toBe(true)
        expect(tryUnlinkSync(url)).toBe(false)

        const url2 = tmpFile('unlink2.txt')
        writeSync(url2, 'x')
        expect(await tryUnlink(url2)).toBe(true)
        expect(await tryUnlink(url2)).toBe(false)
    })

    it('isAccessibleDir / isAccessibleFile distinguish dirs from files', async () => {
        const url = tmpFile('file.txt')
        writeSync(url, 'x')
        const dir = path.dirname(url)

        expect(isAccessibleDirSync(dir)).toBe(true)
        expect(isAccessibleDirSync(url)).toBe(false)
        expect(isAccessibleFileSync(url)).toBe(true)
        expect(isAccessibleFileSync(dir)).toBe(false)

        expect(await isAccessibleDir(dir)).toBe(true)
        expect(await isAccessibleFile(url)).toBe(true)
    })

    it('isAccessibleFile honors the extension filter', () => {
        const url = tmpFile('script.jsx')
        writeSync(url, 'x')

        expect(isAccessibleFileSync(url, '.jsx')).toBe(true)
        expect(isAccessibleFileSync(url, '.scpt')).toBe(false)
    })

})
