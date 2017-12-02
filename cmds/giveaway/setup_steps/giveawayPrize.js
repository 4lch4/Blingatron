const SetupStep = require('./SetupStep')

module.exports = class GiveawayPrize extends SetupStep {
  get stepNum () { return 4 }

  async beginningPrompt (message, winnerCount) {
    if (!winnerCount) return Promise.reject(new Error('The winner count you provided was invalid. Be sure to use a number between 1 and 10.'))

    return message.channel.send(
      `:ring: ${winnerCount} winner(s) it is!\n\n` +
      'Lastly, what is the prize for the giveaway?'
    )
  }

  collectResponse (message, collector) {
    return new Promise((resolve, reject) => {
      collector.on('collect', (msg, c) => {
        resolve(msg.content)
      })

      collector.on('end', (c, r) => { if (r === 'time') reject(new Error(this.timeoutPrompt())) })
    })
  }
}
