const yargs = require('yargs')


const s22Slash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    let result = yargs(command.text).parse()
    await respond(`here you go:\n${JSON.stringify(result, null, 4)}`);
}

module.exports = s22Slash