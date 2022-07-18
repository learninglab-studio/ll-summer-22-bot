const yargs = require('yargs')
const { sendToAirtable } = require('../utilities/airtable-tools')

const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(`*********command*************`)
    console.log(JSON.stringify(command, null, 4))
    let result = yargs(command.text).parse()
    const payload = {
        blocks: [
            {
                "type": "actions",
                "elements": makeButtons(result._)
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
    await respond({
        "blocks": [
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "test1",
                            "emoji": true
                        },
                        "value": "clicked_test1",
                        "action_id": "stills-request-test1"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "test2",
                            "emoji": true
                        },
                        "value": "clicked_test2",
                        "action_id": "stills-request-test2"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "for yargs:\n{\n    \"_\": [\n        \"test1\",\n        \"test2\"\n    ],\n    \"$0\": \"app.js\"\n}"
                }
            }
        ]
     });
    sendToAirtable({
        record: {
            "SlackTs": "command.event_ts or similar",
            "SlackJSON": JSON.stringify(command, null, 4),
            "Timecode": "will compute this",
            // "SlackUserId": message.user,
            "Name": command.text
        },
        table: "StillsRequests"
    })
}

const makeButtons = (arr) => {
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

