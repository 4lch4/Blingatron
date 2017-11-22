const SetupStep = require('./SetupStep')

module.exports = class GiveawayPrize extends SetupStep {
  get stepNum () { return 4 }

  beginningPrompt (winnerCount) {
    if (!winnerCount) throw new Error('The winner count you provided was invalid. Be sure to use a number between 1 and 10.')

    return `:ring: ${winnerCount} winner(s) it is!\n\n` +
      'Lastly, what is the prize for the giveaway?'
  }

  async collectResponse (message) {
    const collector = message.channel.createMessageCollector(msg =>
      msg.member.id === message.member.id &&
      msg.channel.id === message.channel.id,
      { time: 60000 })

    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        collector.stop()
        resolve(msg.content)
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
