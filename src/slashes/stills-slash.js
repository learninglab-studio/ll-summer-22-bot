const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    let result = yargs(command.text).parse()
    await respond(`need stills for:${JSON.stringify(command, null, 4)}`);
    sendToAirtable({
        record: {
            "SlackTs": "command.event_ts or similar",
            "SlackJSON": JSON.stringify(command, null, 4),
            "Timecode": "will compute this"
            // "SlackUserId": message.user,
            // "Text": message.text
        },
        table: "StillsRequests"
    })
}

module.exports = stillsSlash

