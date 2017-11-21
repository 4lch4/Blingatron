const { Command } = require('discord.js-commando')

module.exports = class End extends Command {
  constructor (client) {
    super(client, {
      name: 'end',
      group: 'giveaway',
      memberName: 'end',
      guildOnly: true,
      description: 'End a giveaway.',
      examples: ['b!end']
    })
  }

  async run (msg) {
    return msg.say('Heyo, I\'m working.')
  }
}
