const { Command } = require('discord.js-commando')
const reload = require('require-reload')(require)

const path = require('path')
const fs = require('fs')

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
    let responses = []

    try {
      for (let x = 0; x < setupSteps.length; x++) {
        const step = setupSteps[x]
        const response = responses[x - 1]

        message.channel.send(step.beginningPrompt(response))
        responses[x] = await step.collectResponse(message)
      }

      message.channel.send(`:tada: The giveaway for the \`${responses[3]}\` will last for **${responses[1]}** minutes in <#${responses[0]}>!`)
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
async function getSetupSteps () {
  const steps = fs.readdirSync(stepsPath)
  let setupSteps = []

  for (let x = 0; x < steps.length; x++) {
    let stepInc = steps[x]

    if (stepInc !== 'SetupStep.js') {
      let Step = reload(path.join(stepsPath, stepInc))
      setupSteps.push(new Step())
    }
  }

  return sortSetupSteps(setupSteps)
}
