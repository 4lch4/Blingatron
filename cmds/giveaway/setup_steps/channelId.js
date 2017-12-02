const SetupStep = require('./SetupStep')

module.exports = class ChannelId extends SetupStep {
  get stepNum () { return 1 }

  async beginningPrompt (message, input) {
    return message.channel.send(
      ':ring: Let\'s get this show on the road!\n\n' +
      'Which channel would you like to host the giveaway in?'
    )
  }

  collectResponse (message, collector) {
    let attempts = 0

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        // Verify message content is a mentioned channel
        if (/^<#\d+>/.test(msg.content)) {
          resolve(msg.content.slice(2, msg.content.indexOf('>')))
        } else if (attempts++ === 2) {
          resolve(false)
        }
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
