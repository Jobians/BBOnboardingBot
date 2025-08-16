/*CMD
  command: /start
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Run setup if settings is missing or not yet initialized
function ensureSettingsInitialized() {
  if(settings && Object.keys(settings).length >0) {
    return true;
  }

  smartBot.run({ command: '/setup' });
  return false;
}

if (!ensureSettingsInitialized()) return;
