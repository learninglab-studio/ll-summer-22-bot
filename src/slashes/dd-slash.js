const yargs = require('yargs')

const ddSlash = async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(JSON.stringify(command, null, 4))
    // let result = yargs(command.text).parse()
    await respond(`got this command:\n${JSON.stringify(command, null, 4)}`);
}

module.exports = ddSlash