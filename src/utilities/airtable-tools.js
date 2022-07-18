const Airtable = require('airtable')

const sendToAirtable = async ({record, table}) => {
    var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_SUMMER_BASE);
    const result = await base(table)
        .create(record)
        .catch(err => {console.log(err)})
}

module.exports.sendToAirtable = sendToAirtable