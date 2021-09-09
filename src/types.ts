
interface ErrorJson {
    message: string
    stack: string
}

interface AfterEffectsResults<R = any> {
    error: ErrorJson | null,
    logs: string[][],
    result: R
}

/*** Exports ***/

export {
    ErrorJson,
    AfterEffectsResults
}