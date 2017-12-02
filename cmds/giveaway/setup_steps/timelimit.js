const SetupStep = require('./SetupStep')

module.exports = class TimeLimit extends SetupStep {
  get stepNum () { return 3 }

  async beginningPrompt (message, timeLimit) {
    if (!timeLimit) return Promise.reject(new Error('The time limit you entered was invalid.'))

    return message.channel.send(
      `:ring: This giveaway will last **${timeLimit}** minute(s).\n\n` +
      'Next, how many winners will there be? (1 - 10)'
    )
  }

  collectResponse (message, collector) {
    let attempts = 0

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        // Verify message content is a number
        if (/^\d+/.test(msg.content)) {
          resolve(msg.content)
        } else if (attempts++ === 2) {
          resolve(false)
        }
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
