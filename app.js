const { App } = require('@slack/bolt');
require('dotenv').config();
const yargs = require('yargs')
var Airtable = require('airtable');
const s22Slash = require('./src/slashes/s-22-slash')
const ddSlash = require('./src/slashes/dd-slash')
const stillsSlash = require('./src/slashes/stills-slash')
const mw = require('./src/utilities/slack-middleware')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

// Listens to incoming messages that contain "hello"
app.message('hello', mw.noBot, async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.message(/.*/, async ({ message }) => {
    try {
        console.log(JSON.stringify(message, null, 4))
        await sendToAirtable({
            record: {
                "SlackTs": message.ts,
                "SlackJson": JSON.stringify(message, null, 4),
                "SlackUserId": message.user,
                "Text": message.text,
                "SlackChannel": message.channel
            },
            table: "Summer22Slacks"
        })
    } catch (error) {
        console.log(error)
    }
});

app.action(/.*/, async ({ ack, body, client, say }) => {
  await ack();
  console.log(`********ACTION**********`)
  console.log(JSON.stringify(body, null, 4))
  await say(`got that ${body.actions[0].action_id}`)
  if (body.actions[0].action_id.match(/^stills-request-/)) {
    const action_ts = new Date(body.actions[0].action_ts * 1000)
    await sendToAirtable({
      record: {
          "Name": "Test",
          SlackJSON: JSON.stringify(body, null, 4),
          Source: body.actions[0].action_id.replace("stills-request-", ""),
          SlackTs: body.actions[0].action_ts,
          Timecode: `${action_ts.getHours()}:${action_ts.getMinutes()}:${action_ts.getSeconds()}.${action_ts.getMilliseconds().toString().padStart(3, "0")}`,
          TimestampDate: (new Date(body.actions[0].action_ts * 1000)).toUTCString(),
          // dateObj = ;
          // utcString = dateObj.toUTCString();
          // time = utcString.slice(-11, -4);
      },
      table: "StillsRequests"
    })
  } else {
    
  }
  
  // Update the message to reflect the action
});


app.event(/.*/, async ({ event, client, logger }) => {
    try {
      // Call chat.postMessage with the built-in client
    //   const result = await client.chat.postMessage({
    //     channel: welcomeChannelId,
    //     text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
    //   });
      logger.info(event);
      await sendToAirtable({
        record: {
            "SlackTs": event.event_ts,
            "SlackJson": JSON.stringify(event, null, 4),
            // "SlackUserId": message.user,
            // "Text": message.text
        },
        table: "Summer22Events"
    })
    }
    catch (error) {
      logger.error(error);
    }
  });

app.command('/s22', s22Slash);
app.command('/dd', ddSlash);
app.command('/stills', stillsSlash);

(async () => {
  // Start your app
  console.log(`connecting with `)
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();


const sendToAirtable = async ({record, table}) => {
    var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_SUMMER_BASE);
    const result = await base(table)
        .create(record)
        .catch(err => {console.log(err)})
}