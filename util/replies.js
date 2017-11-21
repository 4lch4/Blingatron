module.exports = {
  /** Stores some of the replies for creating a giveaway. */
  create: {
    /** Message for initiating a giveaway creation. */
    step1: ':ring: Let\'s get this show on the road!\n\nWhich channel would you like to host the giveaway in?',

    /**
     * Message to display the channel hosting the giveaway and retrieve the time
     * limit.
     *
     * @param {Number} channelId
     */
    step2: channelId => {
      return `:ring: Sounds like the giveaway is going to be in <#${channelId}>.\n\n` +
        'Now, how many minutes long should the giveaway last?'
    },

    /**
     * Message to display countdown time limit and retrieve winner count.
     *
     * @param {Number} timeLimit
     */
    step3: timeLimit => {
      return `:ring: This giveaway will last **${timeLimit}** minute(s).\n\n` +
        'Next, how many winners will there be? (1 - 10)'
    },

    /**
     * Message to display the winner count and retrieve the giveaway prize.
     *
     * @param {String}
     */
    step4: winnerCount => {
      return `:ring: ${winnerCount} winner(s) it is!\n\n` +
        'Lastly, what is the prize for the giveaway?'
    }
  }
}
