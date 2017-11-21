const { Command } = require('discord.js-commando')

module.exports = class Reroll extends Command {
  constructor (client) {
    super(client, {
      name: 'reroll',
      group: 'giveaway',
      memberName: 'reroll',
      guildOnly: true,
      description: 'Choose a new winner from the previous giveaway.',
      examples: ['b!reroll']
    })
  }

  async run (msg) {
    return msg.say('Heyo, I\'m working.')
  }
}
