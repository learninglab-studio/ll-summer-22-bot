const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    let result = yargs(command.text).parse()
    await respond(makeBlocks(command));
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

const makeBlocks = () => {
    return {
        blocks: [
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "PGM1",
                            "emoji": true
                        },
                        "value": "clicked_PGM1",
                        "action_id": "stills-request-0"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "PGM2",
                            "emoji": true
                        },
                        "value": "clicked_PGM2",
                        "action_id": "stills-request-1"
                    }
                ]
            },
        ]
    }
}

module.exports = stillsSlash

