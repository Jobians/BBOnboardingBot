/*CMD
  command: /setup
  help: 
  need_reply: 
  auto_retry_time: 
  folder: ⚙️ Setup
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

Bot.sendMessage('⚠️ Setup command NOT executed. See /setup code for details.');
// after setup you need to comment this line:
// return

// Define supported languages for the bot
const languages = ['en'];

// Run language setup commands for each language
let cmdName;
for (let i in languages) {
  cmdName = 'lng-' + languages[i];
  Bot.run({ command: cmdName });
}

var panel = {
  title: 'Bot Settings',
  description: 'General bot configuration',
  index: 0,
  icon: 'settings',
  button_title: 'SAVE',
  on_saving: {
    command: '/complete_setup'
  },
  fields: [
    {
      name: 'SPREADSHEET_ID',
      title: 'Spreadsheet ID',
      description: 'Paste the Google Sheets ID (from its URL)',
      type: 'string',
      placeholder: 'e.g. 1h_c8THQKd4sXXv8ripOiD3s1BXi0lRVxzqXv0-k3Tx8',
      value: '1h_c8THQKd4sXXv8ripOiD3s1BXi0lRVxzqXv0-k3Tx8'
    }
  ]
};

// Register the configuration panel
AdminPanel.setPanel({
  panel_name: 'BotConfig',
  data: panel
});

// Final setup message
Bot.sendMessage(
  '✅ Setup panel created successfully.\n\n⚠️ Please go to the Bots.Business app and configure the Admin Panel *before using the bot* to avoid any errors.'
);

