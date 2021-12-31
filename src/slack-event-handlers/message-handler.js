const { cyan, magenta, yellow, blue } = require("../utilities/mk-utilities");
const resourceFromMessageLink = require(`../airtable-record-factories/resource-from-message-link`)

exports.hello = async ({ message, say }) => {
    blue(message)
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
}

exports.rocket = async ({ message, say }) => {
    await say(`thanks for the :rocket:, <@${message.user}>`);
}

exports.parseAll = async ({ message, say }) => {
    magenta(`parsing all messages`)
    yellow(message.channel)
    blue(process.env.SLACK_CREATE_RESOURCE_CHANNEL)
    if (message.channel == process.env.SLACK_CREATE_RESOURCE_CHANNEL) {
        magenta(`handling message`)
        yellow(message)
        // let theResource = await resourceFromMessageLink(message);
        magenta(theResource)
        await say(`got a message in the resource channel`) 
    } else {
        magenta(`some other message we aren't handling now`)
        yellow(message)
    }
}

