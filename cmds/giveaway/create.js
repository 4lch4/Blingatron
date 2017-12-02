const { Command } = require('discord.js-commando')
const reload = require('require-reload')(require)

const path = require('path')
const fs = require('fs-extra')

const SetupStep = require('./setup_steps/SetupStep')  // Used for JSDoc
const stepsPath = path.join(__dirname, './setup_steps')

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
    const setupSteps = await getSetupSteps()
    const collector = message.channel.createMessageCollector(msg =>
      msg.member.id === message.member.id &&
      msg.channel.id === message.channel.id,
      { time: 60000 })
    let responses = []

    try {
      for (let step of setupSteps) {
        const response = responses[step.stepNum - 1]   // Response from previous question

        await step.beginningPrompt(message, response)
        responses[step.stepNum] = await step.collectResponse(message, collector)
      }

      collector.stop()

      message.channel.send(`:tada: The giveaway for the \`${responses[4]}\` will last for **${responses[2]}** minutes in <#${responses[1]}>!`)
    } catch (err) {
      message.channel.send(err.message)
    }
  }
}

/**
 * Sorts the given steps by their stepNum property and returns the array using
 * a promise.
 *
 * @param {SetupStep[]} steps
 */
async function sortSetupSteps (steps) {
  let newSteps = []

  for (let step of steps) {
    newSteps[step.stepNum - 1] = step
  }

  return Promise.resolve(newSteps)
}

/**
 * Reads the setup_steps directory to get available step files, excluding the
 * base SetupStep.js class. They're placed into an array sorted by step number
 * and returned using a promise.
 */
function getSetupSteps () {
  return new Promise((resolve, reject) => {
    fs.readdir(stepsPath).then(steps => {
      let setupSteps = []

      for (let x = 0; x < steps.length; x++) {
        let stepInc = steps[x]

        if (stepInc !== 'SetupStep.js') {
          let Step = reload(path.join(stepsPath, stepInc))
          setupSteps.push(new Step())
        }
      }

      resolve(sortSetupSteps(setupSteps))
    })
  })
}
