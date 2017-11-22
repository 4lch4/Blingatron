/**
 * The base class for a step in creating a new giveaway.
 *
 * @class
 * @property {number} stepNum - Indicates the step number for proper sorting.
 * @method beginningPrompt
 */
class SetupStep {
  /** Indicates the step number for proper sorting. */
  stepNum () { return 0 }

  /**
   * Initial message to send the user before attempting to collect information.
   */
  beginningPrompt (input) { return 'You didn\'t set a beginning prompt for this step! :face_palm:' }

  /**
   * Message to send when the timer has run out on collecting a response from
   * the user.
   */
  timeoutPrompt () { return ':hourglass: Looks like you\'re no longer there... We can just start over another time.' }

  collectResponse (message) {}
}

module.exports = SetupStep
