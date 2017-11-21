const { Command } = require('discord.js-commando')

const replies = require('../../util/replies')

module.exports = class Create extends Command {
  constructor (client) {
    super(client, {
      name: 'create',
      group: 'giveaway',
      memberName: 'create',
      description: 'Create a new giveaway.',
      guildOnly: true,
      examples: ['b!create']
    })
  }

  async run (message) {
    message.channel.send(replies.create.step1)

    const channelId = await collectChannelId(message)
    if (!channelId) message.channel.send('The channel you provided was invalid. Please be sure to mention a valid channel.')
    else message.channel.send(replies.create.step2(channelId))

    const timeLimit = await collectTimeLimit(message)
    if (!timeLimit) message.channel.send('Please be sure to enter a valid number, no alphabetic characters or symbols are allowed.')
    else message.channel.send(replies.create.step3(timeLimit))

    const winnerCount = await collectWinnerCount(message)
    if (!winnerCount) message.channel.send('Please be sure to enter a valid number between 1 and 10.')
    else message.channel.send(replies.create.step4(winnerCount))

    const giveawayPrize = await collectGiveawayPrize(message)
    if (!giveawayPrize) message.channel.send('Please be sure to provide a prize.')
    else message.channel.send(`:tada: The giveaway for the \`${giveawayPrize}\` will last for **${timeLimit}** minutes in <#${channelId}>!`)
  }
}

function Collector (message) {
  return message.channel.createMessageCollector(msg =>
    msg.member.id === message.member.id &&
    msg.channel.id === message.channel.id,
    { time: 60000 })
}

async function collectChannelId (message) {
  const collector = Collector(message)
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

    collector.on('end', (c, r) => { if (r === 'time') resolve(false) })
  })
}

async function collectTimeLimit (message) {
  const collector = Collector(message)
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

async function collectWinnerCount (message) {
  const collector = Collector(message)
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

    collector.on('end', (c, r) => { if (r === 'time') resolve(false) })
  })
}

async function collectGiveawayPrize (message) {
  const collector = Collector(message)

  return new Promise((resolve, reject) => {
    collector.on('collect', (msg, c) => {
      collector.stop()
      resolve(msg.content)
    })

    collector.on('end', (c, r) => { if (r === 'time') resolve(false) })
  })
}
