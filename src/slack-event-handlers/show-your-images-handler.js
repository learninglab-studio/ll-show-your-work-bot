const { yellow, grey, red, cyan, blue, magenta, divider } = require("../utilities/mk-utilities")
const airtableTools = require('../utilities/airtable-tools')
const makeGif = require('../make-gif')

module.exports = async ({ message, client, say }) => {
    magenta(`handling post in show-your-work`)
    // say(`we'll show that, ${message.user}`)
    let tagged_users = message.text.match(/\w+/g).join(" ")
    yellow(message)
    if (message.files) {
        magenta(`handling attachment`)
        var publicResult

        message.files.forEach(async file => {
            if (["mp4", "mov"].includes(file.filetype)) {
                if (file.size < 50000000) {
                    const gifResult = await makeGif({
                        file: file,
                        client: client,
                    })
                    let slackResult = gifResult.slackResult.file
                    magenta(gifResult)
                    file.name = slackResult.name
                    file.title = slackResult.title
                    file.permalink = slackResult.permalink
                    file.permalink_public = slackResult.permalink_public
                } else {
                    return
                }
            }  else {
                publicResult = await client.files.sharedPublicURL({
                    token: process.env.SLACK_USER_TOKEN,
                    file: file.id,
                });
            }

            const theRecord = {
                baseId: process.env.AIRTABLE_SHOW_BASE,
                table: "ShowYourImages",
                record: {
                    "Id": `${file.name}-${message.event_ts}`,
                    "Title": file.title,
                    "FileName": file.name,
                    "SlackFileInfoJson": JSON.stringify(file, null, 4),
                    "ImageFiles": [
                        {
                        "url": makeSlackImageURL(file.permalink, file.permalink_public)
                        }
                    ],
                    "SlackUrl": makeSlackImageURL(file.permalink, file.permalink_public),
                    "PostedBySlackUser": file.user,
                    "SlackTs": message.event_ts,
                    "TaggedSlackUsers": tagged_users,
                }
            }
            magenta(divider)
            cyan(theRecord)
            const airtableResult = await airtableTools.addRecord(theRecord) 

            const mdPostResult = await client.chat.postMessage({
                channel: message.channel,
                thread_ts: message.ts,
                unfurl_media: false,
                unfurl_links: false,
                parse: "none",
                text: `here's the markdown for embedding the image: \n\`\`\`![alt text](${makeSlackImageURL(file.permalink, file.permalink_public)})\`\`\``
            })
        });
    }
}


function makeSlackImageURL (permalink, permalink_public) {
    let secrets = (permalink_public.split("slack-files.com/")[1]).split("-")
    let suffix = permalink.split("/")[(permalink.split("/").length - 1)]
    let filePath = `https://files.slack.com/files-pri/${secrets[0]}-${secrets[1]}/${suffix}?pub_secret=${secrets[2]}`
    return filePath
}
  