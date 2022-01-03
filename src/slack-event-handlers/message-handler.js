const { cyan, magenta, yellow, blue, grey } = require("../utilities/mk-utilities");
const resourceFromMessageLink = require(`../airtable-record-factories/resource-from-message-link`)
const showYourImagesHandler = require(`./show-your-images-handler`)
const showYourWorkHandler = require(`./show-your-work-handler`)
const showYourLinksHandler = require(`./show-your-links-handler`)

exports.hello = async ({ message, client, say }) => {
    blue(message)
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
}

exports.rocket = async ({ message, client, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAllNonBot = async ({ message, client, say }) => {
    magenta(`parsing all non-bot messages`)
    grey(message)
    if (message.channel == process.env.SLACK_SHOW_YOUR_WORK_CHANNEL) {
        yellow(`work`)
        let result = await showYourWorkHandler({ message: message, say: say, client: client })
    } else if (message.channel == process.env.SLACK_SHOW_YOUR_LINKS_CHANNEL) {
        yellow(`link`)
        await showYourLinksHandler({ message: message, say: say })
    } else if (message.channel == process.env.SLACK_SHOW_YOUR_IMAGES_CHANNEL) {
        yellow(`image`)
        await showYourImagesHandler({ message: message, say: say })
    } else {
        yellow(`this isn't work, images or links--not handling for now`)
        grey(message)
    }
}