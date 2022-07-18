const yargs = require('yargs')


const stillsSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    let result = yargs(command.text).parse()
    await respond(`here you go:\n${JSON.stringify(result, null, 4)}`);
}

module.exports = stillsSlash