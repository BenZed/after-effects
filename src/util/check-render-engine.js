import AfterEffects from '../factory'
import Command from '../command'

/******************************************************************************/
// Helpers
/******************************************************************************/

const twoSeconds = () => new Promise(resolve => setTimeout(resolve, 2000))

const waitTwoSecondsSync = () => {
  const nowPlusTwo = Date.now() + 2000

  while (Date.now() < nowPlusTwo) {} // This is disgusting, i feel gross writing this.
}

const createChecker = ae => {

  if (!ae)
    throw new Error('You must provide an AfterEffects instance to checkRenderEngine')

  const aeChecker = new AfterEffects({
    ...ae.options,
    writeResults: true
  })

  return aeChecker

}

/******************************************************************************/
// Commands
/******************************************************************************/

/* global app */

const checkRenderEngineCommand = new Command(shouldBeRenderEngine => {
  const requiresRestart = app.isRenderEngine !== shouldBeRenderEngine
  if (requiresRestart)
    app.quit()

  return requiresRestart
})

const restartCommand = new Command(() => {}) // Blank

/******************************************************************************/
// Exports
/******************************************************************************/

export async function checkRenderEngine (ae) {

  const aeChecker = createChecker(ae)

  const requiresRestart = await aeChecker.execute(checkRenderEngineCommand, !!ae.options.renderEngine)
  if (!requiresRestart)
    return

  // Wait two seconds for After Effects to close, otherwise immediatly sending
  // another command runs the risk of failure.
  await twoSeconds()

  await ae.execute(restartCommand)

  return requiresRestart

}

export function checkRenderEngineSync (ae) {

  const aeChecker = createChecker(ae)

  const requiresRestart = aeChecker.executeSync(checkRenderEngineCommand, !!ae.options.renderEngine)
  if (!requiresRestart)
    return

  // Wait two seconds for After Effects to close, otherwise immediatly sending
  // another command runs the risk of it failure.
  waitTwoSecondsSync()

  ae.excuteSync(restartCommand)

  return requiresRestart

}
