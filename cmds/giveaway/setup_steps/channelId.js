const SetupStep = require('./SetupStep')

module.exports = class ChannelId extends SetupStep {
  get stepNum () { return 1 }

  beginningPrompt (input) {
    return ':ring: Let\'s get this show on the road!\n\n' +
      'Which channel would you like to host the giveaway in?'
  }

  async collectResponse (message) {
    const collector = message.channel.createMessageCollector(msg =>
      msg.member.id === message.member.id &&
      msg.channel.id === message.channel.id,
      { time: 60000 })
    let attempts = 0

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        // Verify message content is a mentioned channel
        if (/^<#\d+>/.test(msg.content)) {
          collector.stop()
          resolve(msg.content.slice(2, msg.content.indexOf('>')))
        } else if (attempts++ === 2) {
          collector.stop()
          resolve(false)
        }
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
