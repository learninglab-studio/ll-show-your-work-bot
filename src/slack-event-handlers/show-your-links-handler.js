const { yellow, grey, red, cyan, blue, magenta, divider } = require("../utilities/mk-utilities")
const airtableTools = require(`../utilities/airtable-tools`)

module.exports = async ({ message, client, say }) => {
    magenta(`got something in show your links`)
    grey(message)
    try {
        const airtableResult = await airtableTools.addRecord({
            baseId: process.env.AIRTABLE_SHOW_BASE,
            table: "ShowYourLinks",
            record: {
                "URL": message.text,
                "SlackTs": message.ts,
                "SlackJson": JSON.stringify(message, null, 4),
                "SlackUser": message.user,
            }
        })
        // TODO: parse and find more elements to send to other tables
    } catch (error) {
        magenta(error)
    }
    return("done")
}
