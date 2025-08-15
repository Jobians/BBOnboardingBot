/*CMD
  command: /lesson
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 📚 Learning
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// This function removes underscores from text to prevent Markdown issues
function escapeMarkdown(text) {
  return text.replace(/_/g, '');
}

// Split parameters from the command (e.g., "L1 2" becomes "L1" and "2")
let [lessonId, stepNumberInput] = params.split(' ');

// If step number is not provided, default to step 1
let stepNumber = stepNumberInput ? Number(stepNumberInput) : 1;

// Get all lessons saved in Bot properties
const lessons = Bot.getProp('Lessons') || [];

// Find the lesson by ID
const lesson = lessons.find(l => l.id === lessonId);
if (!lesson) {
  return Bot.sendMessage(`⚠️ Lesson ${lessonId} not found.`);
}

// Find the specific step in the lesson
const step = lesson.steps.find(s => Number(s.stepNumber) === stepNumber);
if (!step) return; // Should never happen

// Build the step message
let messageText = `Step ${stepNumber}: ${step.text}`;

// If it's the first step, add the lesson description
if (stepNumber === 1 && lesson.description) {
  messageText = `📝 ${lesson.description}\n\nStep ${stepNumber}: ${step.text}`;
}

// Add optional video and help links
if (step.videoUrl) {
  messageText += `\n\n🎬 [Watch Video](${step.videoUrl})`;
}
if (step.helpText) {
  messageText += `\n\nℹ️ [Help Article](${step.helpText})`;
}

// Clean the message text from Markdown-breaking characters
messageText = escapeMarkdown(messageText);

// Set up buttons for the message
let buttons = [];

// Add custom buttons from the step (if available)
if (step.extra?.reply_markup?.inline_keyboard) {
  buttons = step.extra.reply_markup.inline_keyboard;
}

// Add navigation buttons
const navButtons = [];

if (stepNumber > 1) {
  navButtons.push({
    text: '⬅️ Back',
    callback_data: `/lesson ${lessonId} ${stepNumber - 1}`
  });
}

if (stepNumber < lesson.steps.length) {
  navButtons.push({
    text: 'Next ➡️',
    callback_data: `/lesson ${lessonId} ${stepNumber + 1}`
  });
} else {
  // If it's the last step, show a "Take Quiz" or "Done" button
  const quizzes = Bot.getProp('Quizzes') || [];
  const lessonQuiz = quizzes.filter(q => q.lessonId === lessonId);

  if (lessonQuiz.length > 0) {
    navButtons.push({
      text: '📝 Take Quiz',
      callback_data: `/quiz ${lessonId}`
    });
  } else {
    navButtons.push({
      text: '✅ Done',
      callback_data: `/menu`
    });
  }
}

// Add navigation buttons if they exist
if (navButtons.length > 0) {
  buttons.push(navButtons);
}

// Get chat and message info
const chatId = request.message.chat.id;
const messageId = request.message.message_id;

// Check if the step has a photo, and whether the original message does too
const hasPhotoInStep = !!step.photo;
const originalMessageHadPhoto = !!request.message.photo;

// If the media type has changed (photo <-> no photo), delete and send a new message
if ((hasPhotoInStep && !originalMessageHadPhoto) || (!hasPhotoInStep && originalMessageHadPhoto)) {
  Api.deleteMessage({ chat_id: chatId, message_id: messageId });

  if (hasPhotoInStep) {
    // Send a new photo message
    Api.sendPhoto({
      chat_id: chatId,
      photo: step.photo,
      caption: messageText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } else {
    // Send a new text message
    Api.sendMessage({
      chat_id: chatId,
      text: messageText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  }
} else {
  // If media type is same, just edit the message
  if (hasPhotoInStep) {
    Api.editMessageMedia({
      chat_id: chatId,
      message_id: messageId,
      media: {
        type: 'photo',
        media: step.photo,
        caption: messageText,
        parse_mode: 'Markdown'
      },
      reply_markup: { inline_keyboard: buttons }
    });
  } else {
    Api.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: messageText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  }
}

// Save user progress
User.setProp('current_lesson', lessonId);
User.setProp('current_step', stepNumber);

