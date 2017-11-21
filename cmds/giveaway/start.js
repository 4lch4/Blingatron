const { Command } = require('discord.js-commando')

module.exports = class Start extends Command {
  constructor (client) {
    super(client, {
      name: 'start',
      group: 'giveaway',
      memberName: 'start',
      guildOnly: true,
      description: 'Setup a giveaway.',
      examples: ['b!start']
    })
  }

  async run (msg) {
    return msg.say('Heyo, I\'m working.')
  }
}
