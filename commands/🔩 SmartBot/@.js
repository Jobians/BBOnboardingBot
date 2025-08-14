/*CMD
  command: @
  help: 
  need_reply: 
  auto_retry_time: 
  folder: 🔩 SmartBot
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// Load settings from the admin panel
const settings = AdminPanel.getPanelValues('BotConfig');

// Prepare SmartBot parameters
const smartBotParams = {
  currency: "XRP"
};

// Initialize SmartBot instance
let smartBot = new SmartBot({
  debug: true,
  params: smartBotParams
});


// =========================
// CSV Parsing Utilities
// =========================

/**
 * Splits a CSV line into an array of values, handling quoted fields.
 * @param {string} line 
 * @returns {string[]}
 */
function splitCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++; // Skip the next quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Parses a CSV string into an array of objects.
 * @param {string} csv
 * @returns {Object[]}
 */
function parseCsv(csv) {
  const rows = [];
  let currentLine = '';
  let insideQuotes = false;

  for (const line of csv.split('\n')) {
    const quoteCount = (line.match(/"/g) || []).length;

    if (insideQuotes) {
      currentLine += '\n' + line;
      if (quoteCount % 2 !== 0) {
        rows.push(currentLine);
        currentLine = '';
        insideQuotes = false;
      }
    } else {
      currentLine = line;
      if (quoteCount % 2 !== 0) {
        insideQuotes = true;
      } else {
        rows.push(currentLine);
        currentLine = '';
      }
    }
  }

  const headers = splitCsvLine(rows.shift()).map(h => h.replace(/^"|"$/g, '').trim());

  return rows.map(rowLine => {
    const values = splitCsvLine(rowLine);
    return headers.reduce((obj, header, index) => {
      const value = (values[index] || '')
        .replace(/^"|"$/g, '')
        .replace(/""/g, '"')
        .trim();
      obj[header] = value;
      return obj;
    }, {});
  });
}

// =========================
// Lesson Parsing
// =========================

/***
 * Parses lesson rows into structured lesson objects.
 * @param {Object[]} rows
 * @returns {Object[]}
 */
function parseLessons(rows) {
  const lessons = [];
  let currentLesson = null;

  for (const row of rows) {
    if (row.id) {
      currentLesson = { id: row.id, lesson: row.lesson, description: row.Description, steps: [] };
      lessons.push(currentLesson);
    }

    if (!currentLesson) continue;

    let extraData = row.extra || '';
    try {
      if (extraData.trim().startsWith('{')) {
        extraData = JSON.parse(extraData);
      }
    } catch {}

    currentLesson.steps.push({
      stepNumber: row.step,
      text: row.text,
      photo: row.photo,
      videoUrl: row['YouTube Video'],
      helpText: row.Help,
      extra: extraData
    });
  }

  return lessons;
}

// =========================
// Quiz Parsing
// =========================

/**
 * Parses quiz rows into structured quiz objects.
 * @param {Object[]} rows
 * @returns {Object[]}
 */
function parseQuizzes(rows) {
  return rows.map(row => ({
    id: row.id,
    lessonId: row.lesson_id,
    question: row.question,
    answers: row.answers
      ? row.answers
          .split('\n')
          .map(a => a.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
      : [],
    correctAnswerIndex: parseInt(row.correct_index, 10)
  }));
}

// =========================
// Meta Parsing
// =========================

/**
 * Returns static meta information.
 * @returns {Object}
 */
function parseMeta() {
  return {
    version: 1,
    templateVersion: 1,
    language: 'en',
    updatedAt: '15.07.2025'
  };
}
