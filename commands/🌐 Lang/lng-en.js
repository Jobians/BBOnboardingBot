/*CMD
  command: lng-en
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 🌐 Lang
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

const currentLang = '🇺🇸 English';

// Language configuration object
const LANG = {
  commands: {
    '/start': {
      text: '*🌐 Choose your preferred language*\n\n_Current language:_ *{curLang}*',
      inline_buttons: '#/keyboard/selectlanguage'
    },
    '/menu': {
      edit: true,
      text: '👋 Welcome to BB GuideBot!\n\nI’m your personal guide to the Bots.Business platform. 🚀\nWe’ll start from zero and help you become a BB pro.\n\nLearn step by step, access lessons, and test your skills with quizzes. 💡\n\nReady? Click the start button to begin!',
      inline_buttons: '#/keyboard/userMenu'
    },
    '/learning': {
      edit: true,
      text: '📚 *Lessons Library*\n\nSelect a lesson from the list below to start learning. This course guides you through every step of the Bots.Business (BB) platform—from your first launch to advanced BJS scripting! 🚀',
      parse_mode: 'Markdown',
      inline_buttons: '#/keyboard/lessons'
    },
    '/faq': {
      edit: true,
      text: '📖 *FAQs*\n\nQ: What is "BJS"?\nA: It is Bot JavaScript. It’s ordinary JavaScript with some custom inserts for BB bots.\n\nQ: I do not know JavaScript. What should I do?\nA: Usually you don’t need anything complicated for developing bots. You can read a couple of articles about JS:\n- [W3Schools JS Syntax](https://www.w3schools.com/js/js_syntax.asp)\n- [Wikipedia: JavaScript Syntax](https://en.wikipedia.org/wiki/JavaScript_syntax)',
      parse_mode: 'Markdown',
      inline_buttons: '#/keyboard/userMenu'
    },
    '/contact_support': {
      edit: true,
      text: '💬 **Contact Support**\n\nNeed help? You can reach out directly via Telegram or check our documentation:\n\n• Live support: @BotsBusinessAdmin\n• Help articles: [help.bots.business](https://help.bots.business)',
      parse_mode: 'Markdown',
      inline_buttons: '#/keyboard/userMenu'
    }
  },
  titles: {
    curLang: currentLang
  },
  types: {
    keyboard: {
      selectlanguage: [[{ text: '🇺🇸 English', command: 'setLng en' }]],
      userMenu: [
        [{ text: '📚 Start Learning', command: '/learning' }],
        [
          { text: '📖 FAQs', command: '/faq' },
          { text: '💬 Support', command: '/contact_support' }
        ]
      ],
      lessons: [
        [{ text: '{lesson_1_text}', command: '{lesson_1_cmd}' }],
        [{ text: '{lesson_2_text}', command: '{lesson_2_cmd}' }],
        [{ text: '{lesson_3_text}', command: '{lesson_3_cmd}' }],
        [{ text: '{lesson_4_text}', command: '{lesson_4_cmd}' }],
        [{ text: '{lesson_5_text}', command: '{lesson_5_cmd}' }],
        [{ text: '🏠 Return to Menu', command: '/menu' }]
      ]
    }
  }
};

// Setup language for the bot
smartBot.setupLng('en', LANG);

