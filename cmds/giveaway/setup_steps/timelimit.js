const SetupStep = require('./SetupStep')

module.exports = class TimeLimit extends SetupStep {
  get stepNum () { return 3 }

  beginningPrompt (timeLimit) {
    return `:ring: This giveaway will last **${timeLimit}** minute(s).\n\n` +
      'Next, how many winners will there be? (1 - 10)'
  }

  async collectResponse (message) {
    const collector = message.channel.createMessageCollector(msg =>
      msg.member.id === message.member.id &&
      msg.channel.id === message.channel.id,
      { time: 60000 })
    let attempts = 0

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        // Verify message content is a number
        if (/^\d+/.test(msg.content)) {
          collector.stop()
          resolve(msg.content)
        } else if (attempts++ === 2) {
          collector.stop()
          resolve(false)
        }
      })

      collector.on('end', (c, r) => { if (r === 'time') resolve(false) })
    })
  }
}
