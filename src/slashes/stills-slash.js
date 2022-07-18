const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(`*********command*************`)
    console.log(JSON.stringify(command, null, 4))
    let result = yargs().parse("test test ")
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
                    "text": `for yargs:\n${JSON.stringify(result, null, 4)}`
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
            "Name": command.text
        },
        table: "StillsRequests"
    })
}

const makeElements = (text) => {
    const elements = ["pgm1", "pgm2"]
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

