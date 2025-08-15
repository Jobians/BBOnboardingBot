/*CMD
  command: /learning
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 📚 Learning
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Load lessons from bot storage
const lessons = Bot.getProp('Lessons') || [];

// Loop through each lesson and add SmartBot placeholders
lessons.forEach((lesson, index) => {
  smartBot.add({
    // Placeholder for the lesson button text
    [`lesson_${index + 1}_text`]: `${lesson.id} - ${lesson.lesson}`,

    // Placeholder for the lesson button command
    [`lesson_${index + 1}_cmd`]: `/lesson ${lesson.id}`
  });
});
