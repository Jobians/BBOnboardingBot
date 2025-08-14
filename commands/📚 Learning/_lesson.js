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

function escapeMarkdown(text) {
  return text.replace(/(\*\*[^\*]*?)_([^\*]*?\*\*)/g, '$1\\_$2');
}

// Parse params: "L1" or "L1 2"
let [lessonId, stepNumberParam] = params.split(' ');
let stepNumber = stepNumberParam ? Number(stepNumberParam) : 1;

const lessons = Bot.getProp('Lessons') || [];
const lesson = lessons.find(l => l.id === lessonId);
if (!lesson) return Api.sendMessage(`⚠️ Lesson ${lessonId} not found.`);

const step = lesson.steps.find(s => Number(s.stepNumber) === Number(stepNumber));
if (!step) {
    // End of lesson → show quiz if exists
    const quizzes = Bot.getProp('Quizzes') || [];
    const lessonQuiz = quizzes.filter(q => q.lesson_id === lessonId);
    if (lessonQuiz.length) return sendQuiz(lessonQuiz, 0); // start first quiz
    return Api.sendMessage('✅ You have completed this lesson!');
}

// Combine description with first step text
let text = step.text;
if (stepNumber === 1 && lesson.description) {
    text = `📝 ${lesson.description}\n\nStep ${stepNumber}: ${step.text}`;
} else {
    text = `Step ${stepNumber}: ${step.text}`;
}

// Append video/help links
if (step.videoUrl) text += `\n\n🎬 [Watch Video](${step.videoUrl})`;
if (step.helpText) text += `\n\nℹ️ [Help Article](${step.helpText})`;

// Escape for Markdown (classic)
text = escapeMarkdown(text);
Bot.inspect(text)

// Navigation + Extra buttons
let buttons = [];
if (step.extra?.reply_markup?.inline_keyboard)
    buttons = step.extra.reply_markup.inline_keyboard;

const navButtons = [];
if (Number(stepNumber) > 1)
    navButtons.push({ text: '⬅️ Back', callback_data: `/lesson ${lessonId} ${Number(stepNumber)-1}` });
if (Number(stepNumber) < lesson.steps.length)
    navButtons.push({ text: 'Next ➡️', callback_data: `/lesson ${lessonId} ${Number(stepNumber)+1}` });
if (navButtons.length) buttons.push(navButtons);

// Always use edit mode because it's a callback
const messageId = request.message.message_id;

// Send edited message
if (step.photo) {
    Api.editMessageMedia({
        message_id: messageId,
        chat_id: request.message.chat.id,
        media: {
            type: 'photo',
            media: step.photo,
            caption: text,
            parse_mode: 'Markdown'
        },
        reply_markup: { inline_keyboard: buttons }
    });
} else {
    Api.editMessageText({
        message_id: messageId,
        chat_id: request.message.chat.id,
        text: text,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
    });
}

// Save user progress
User.setProp('current_lesson', lessonId);
User.setProp('current_step', stepNumber);

