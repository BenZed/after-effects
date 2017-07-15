
import { assert } from 'chai'
import { AfterEffects } from '../src'

/* globals describe it */

describe('AfterEffects', () => {

  it('sends commands to AfterEffects', async () => {

    const ae = new AfterEffects({
      shortcut: 'execute',
      includes: []
    })

    await ae(() => { alert('hello from Node') })

  })

  // and so on

})
