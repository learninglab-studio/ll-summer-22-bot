const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(`*********command*************`)
    console.log(JSON.stringify(command, null, 4))
    let result = yargs(command.text).parse()
    let buttons = await makeButtons(result._)
    const payload = {
        blocks: [
            {
                "type": "actions",
                "elements": buttons
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `testing`
                }
            }
        ]
    }
    await respond(payload);
    sendToAirtable({
        record: {
            "SlackTs": "command.event_ts or similar",
            "SlackJSON": JSON.stringify(command, null, 4),
            "Timecode": "will compute this",
            // "SlackUserId": message.user,
            "Name": command.text,
            "Type": "session"
        },
        table: "StillsRequests"
    })
}

const makeButtons = async (arr) => {
    const elements = []
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
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

