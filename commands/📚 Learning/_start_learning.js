/*CMD
  command: /start_learning
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 📚 Learning
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

const lessons = Bot.getProp('Lessons') || [];

const buttons = lessons.map(l => [{
    text: `${l.id} - ${l.lesson}`,
    callback_data: `/lesson ${l.id}`
}]);

Api.sendMessage({
    text: "📚 **Choose a lesson to start:**",
    reply_markup: { inline_keyboard: buttons }
});
