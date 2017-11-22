const SetupStep = require('./SetupStep')

module.exports = class WinnerCount extends SetupStep {
  get stepNum () { return 2 }

  beginningPrompt (channelId) {
    if (!channelId) throw new Error('The channel you provided was invalid. please be sure to mention a valid channel.')

    return `:ring: Sounds like the giveaway is going to be in <#${channelId}>.\n\n` +
      'Now, how many minutes long should the giveaway last?'
  }

  async collectResponse (message) {
    const collector = message.channel.createMessageCollector(msg =>
      msg.member.id === message.member.id &&
      msg.channel.id === message.channel.id,
      { time: 60000 })
    let attempts = 0

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        // Verify message content is a number between 1 and 10
        if (/^\d+/.test(msg.content) && msg.content > 0 && msg.content < 11) {
          collector.stop()
          resolve(msg.content)
        } else if (attempts++ === 2) {
          collector.stop()
          resolve(false)
        }
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
