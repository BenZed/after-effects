
import is from '@benzed/is'
import * as api from './api'

import { babelify } from './util/transpile'
import { inputToSource } from './command'
import { AfterEffects, AfterEffectsOptions } from './types'

// Defaults

const DEFAULTS: Partial<AfterEffectsOptions> = {
    handleErrors: true,
    writeResults: true,
    renderEngine: false,
    logger: console.log.bind(console),
    shortcut: 'executeSync'
}

function validateOptionsAndTranspileIncludes(this: AfterEffects<any, any>, options = {}, defs = DEFAULTS) {

    defs = { ...defs } // Rewrap to prevent future setOptions calls from mutating past options

    if (!is.plainObject(options))
        throw new Error('options, if defined, must be a plain object.')

    this.options = {
        ...options,
        ...DEFAULTS
    }

    // Codify Includes
    this.code = this.options.includes.map(inputToSource).map(babelify)
}

// Exports

type Definition = Parameters<typeof Object.defineProperty>[2]

const defineGet = (
    input: Partial<AfterEffects<any, any>>,
    key: keyof AfterEffects<any, any>,
    get: () => string | null
) => Object.defineProperty(input, key, { get })

export default function createAfterEffectsInstance<A extends any[], V>(options: Partial<AfterEffectsOptions> = {}) {

    const afterEffects: AfterEffects<A, V> = () => { }
    afterEffects.options = {
        ...options,
        ...DEFAULTS
    }
    afterEffects.execute = api.execute
    afterEffects.executeSync = api.executeSync
    afterEffects.create = api.create
    afterEffects.createSync = api.createSync

    afterEffects.scriptsDir = api.getScriptsDirSync(afterEffects.options)

    return afterEffects
}
