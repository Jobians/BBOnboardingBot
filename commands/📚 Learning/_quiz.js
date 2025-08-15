/*CMD
  command: /quiz
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 📚 Learning
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Split parameters from the callback query (e.g. "/quiz L1 2 1")
let parts = params.split(' ');
let lessonId = parts[0]; // e.g. "L1"
let questionIndex = parts[1] ? parseInt(parts[1]) : 0;
let selectedIndex = parts[2] ? parseInt(parts[2]) : null;

// Get quizzes from Bot storage
const quizzes = Bot.getProp('Quizzes') || [];
const lessonQuiz = quizzes.filter(q => q.lessonId === lessonId);

// Shared button: Back to Lesson Library
const backToLessonsButton = [
  [
    { text: '📚 Back to Lesson Library', callback_data: '/learning' }
  ]
];

// Handle case where no quiz is available for this lesson
if (!lessonQuiz.length) {
  return Api.editMessageText({
    chat_id: request.message.chat.id,
    message_id: request.message.message_id,
    text: '⚠️ There’s no quiz available for this lesson yet.'
  });
}

const chatId = request.message.chat.id;
const messageId = request.message.message_id;
const letters = ['A', 'B', 'C', 'D', 'E', 'F']; // Can expand if needed

// === 📌 Case: User answered a question ===
if (parts.length === 3) {
  const currentQuestion = lessonQuiz[questionIndex];

  // If question index is invalid
  if (!currentQuestion) {
    return Api.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: '⚠️ Hmm, that question doesn’t seem to exist. Please try again.'
    });
  }

  const correctIndex = Number(currentQuestion.correctAnswerIndex);
  const selectedNum = Number(selectedIndex) + 1;  // add 1 here because correctIndex is 1-based
  const isCorrect = selectedNum === correctIndex;

  let feedback = isCorrect
  ? '✅ *Great job!* That’s the correct answer.'
  : `❌ *Oops! That’s not quite right.*\n\n✅ The correct answer was: _${letters[correctIndex - 1]}. ${currentQuestion.answers[correctIndex - 1]}_`;

  const nextIndex = questionIndex + 1;
  const nextQuestion = lessonQuiz[nextIndex];

  if (nextQuestion) {
    const nextButton = [
      [
        {
          text: '➡️ Next Question',
          callback_data: `/quiz ${lessonId} ${nextIndex}`
        }
      ]
    ];

    return Api.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: feedback,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: nextButton }
    });
  } else {
    // End of quiz
    feedback += '\n\n🎉 *Well done!* You’ve completed the quiz.';

    return Api.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: feedback,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: backToLessonsButton }
    });
  }
}

// === 📌 Case: Show current question (user hasn't answered yet) ===
const currentQuestion = lessonQuiz[questionIndex];

if (!currentQuestion) {
  return Api.editMessageText({
    chat_id: chatId,
    message_id: messageId,
    text: '🎉 *Quiz complete!* Thanks for taking part — you’ve finished all the questions.',
    reply_markup: {
      inline_keyboard: backToLessonsButton
    }
  });
}

// Format question with answers like: "A. Option1\nB. Option2"
const formattedOptions = currentQuestion.answers
  .map((answer, i) => `${letters[i]}. ${answer}`)
  .join('\n');

const questionText = `❓ *Question:* ${currentQuestion.question}\n\n${formattedOptions}`;

// Generate buttons for each answer choice
const buttons = currentQuestion.answers.map((_, i) => ({
  text: letters[i],
  callback_data: `/quiz ${lessonId} ${questionIndex} ${i}`
}));

// Show the current question and buttons
Api.editMessageText({
  chat_id: chatId,
  message_id: messageId,
  text: questionText,
  parse_mode: 'Markdown',
  reply_markup: { inline_keyboard: [buttons] }
});

