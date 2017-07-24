import AfterEffects from './factory'
import Command from './command'
import { checkRenderEngine, checkRenderEngineSync } from './util/check-render-engine'

export { AfterEffects, Command, checkRenderEngine, checkRenderEngineSync }

export default new AfterEffects()
