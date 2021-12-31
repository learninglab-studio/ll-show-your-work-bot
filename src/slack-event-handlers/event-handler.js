const { blue, yellow, cyan, magenta } = require('./utilities/mk-utilities')
const airtableTools = require(`./utilities/airtable-tools`)
const { handleSlackedFcpxml } =  require('./fcpxml-bot/fcpxml-tools')
const path = require('path')
const appHomeHandler = require('./app-home-handler')
const handleImageFile = require(`./image-bot/external-link-listener`)
// const { prepareStepArgs } = require('@slack/bolt/dist/WorkflowStep')

exports.fileShared = async ({ event, client}) => {
  try {
    const handledImageFiles = ["image/gif", "image/jpeg", "image/png"]
    magenta(`launching fileShared handler`)
    magenta(event)
    const fileInfo = await client.files.info({
      file: event.file_id,
    });
    yellow(`handing ${event.file_id}, here's the fileInfo;`)
    yellow(fileInfo)
    if (event.channel_id == process.env.SLACK_EXTERNAL_LINKS_CHANNEL && handledImageFiles.includes(fileInfo.file.mimetype) ) {
      await handleImageFile(event, client, fileInfo)
      magenta(`handled image file`)
    } else if (event.channel_id == process.env.SLACK_FCPXML_CHANNEL && path.extname(fileInfo.file.name) == ".fcpxml" ) {
      yellow(`handling ${fileInfo.file.name} with ext ${path.extname(fileInfo.file.name)}`)
      cyan(event)
      await handleSlackedFcpxml(event, client, fileInfo)
    }
  } catch (error) {
    yellow(`eventHandler.fileShared failed`)
    console.error(error)
  }
}

exports.reactionAdded = async ({ event }) => {
  yellow(`got a reactionAdded: ${event.type}:`)
  cyan(event)
}

exports.reactionRemoved = async ({ event }) => {
  yellow(`got a reactionRemoved ${event.type}:`)
  cyan(event)
}

exports.appHomeOpened = appHomeHandler

exports.log = async ({ event }) => {
  const handledEvents = ["message","reaction_added", "reaction_removed", "app_home_opened", "file_shared"]
  if (handledEvents.includes(event.type)) {
    blue(`got an event of type ${event.type}, handling this elsewhere`)
    // magenta(event)
  } else {
    yellow(`currently unhandled event of type ${event.type}:`)
    cyan(JSON.stringify(event))
  }
}