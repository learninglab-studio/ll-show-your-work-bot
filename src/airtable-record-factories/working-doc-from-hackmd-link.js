const airtableTools = require(`../utilities/airtable-tools`)
const { yellow, blue, cyan } = require(`../utilities/mk-utilities`)
const cheerio = require(`cheerio`)
const axios = require(`axios`)
const { magenta } = require("colors")

module.exports = async function (url) {
    console.log(`starting starting workingDocFromHackMd`)
    // cheerio and axios load up the content
    const hackMdData = await getHackMdData(url)
    // yellow(hackMdData)
    const airtableResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_SHOW_BASE,
            table: "WorkingDocs",
            record: {
                UniqueName: `add programmatically`,
                Title: hackMdData.title,
                HackMdUrl: url,
                Markdown: hackMdData.body,
                Type: [`workingDoc`]
            }
    })
    return airtableResult
}

async function getHackMdData(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      let result = {
        title: $('title').text(),
        body: $('#doc').text()
        }   
      return result
    } catch (err) {
      console.error(err);
    }
}