const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(`*********command*************`)
    console.log(JSON.stringify(command, null, 4))
    let result = yargs().parse(command.text)
    const payload = {
        blocks: [
            {
                "type": "actions",
                "elements": makeElements(command.text)
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `for yargs:\n${JSON.stringify(yargs, null, 4)}`
                }
            }
        ]
    }
    await respond(JSON.stringify(payload, null, 4));
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

const makeElements = (text) => {
    const elements = []
    const words = text.split("")
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        elements.push({
            "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": element,
                            "emoji": true
                        },
                        "value": `clicked_${element}`,
                        "action_id": `stills-request-${element}`
        })
    }
    return elements
}

const makeBlocks = () => {
    return 
}

module.exports = stillsSlash

