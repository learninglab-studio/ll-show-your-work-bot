module.exports.noBot = async ({ message, next }) => {
  if (!message.subtype || message.subtype !== 'bot_message') {
    await next();
  }
}

module.exports.isWork = async ({message, next}) => {
  if (message.channel == process.env.SLACK_SHOW_YOUR_WORK_CHANNEL) {
    await next();
  }
}