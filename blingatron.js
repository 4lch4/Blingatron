const config = require('./util/config.json')
const path = require('path')

const { CommandoClient } = require('discord.js-commando')
const client = new CommandoClient({
  commandPrefix: 'b!'
})

client.registry
        .registerDefaultTypes()
        .registerGroups([['giveaway', 'Giveaway command group.']])
        .registerCommandsIn(path.join(__dirname, 'cmds'))

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.login(config.token)
