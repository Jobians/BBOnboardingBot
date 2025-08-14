/*CMD
  command: setLng
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 🌐 Lang
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Set the new language for the user, either "en" for English or "es" for Spanish
let newLang  = params; // "params" contains the language code

// Update the user's language preference in the bot system
smartBot.setUserLang(newLang);

// Add the new language setting to the bot's internal data structure
smartBot.add({ newLang: newLang });

smartBot.run({
  command: "/menu"
});
