/*CMD
  command: lng-es
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 🌐 Lang
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

const currentLang = "🇪🇸 Spanish";

// Objeto de configuración del idioma
const LANG = {
  commands: {
    '/start': {
      text: '*🌐 Elige tu idioma preferido*\n\n_Idioma actual:_ *{curLang}*'
    }
  }
};

// Configurar idioma para el bot
smartBot.setupLng("es", LANG);

