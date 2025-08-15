/*CMD
  command: /complete_setup
  help: 
  need_reply: 
  auto_retry_time: 
  folder: ⚙️ Setup
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

// =========================
// Sheet Fetching Utilities
// =========================

/**
 * Fetches a specific Google Sheet as CSV and triggers the parser.
 * @param {string} sheetName
 */
function fetchSheet(sheetName) {
  const spreadsheetId = AdminPanel.getFieldValue({
    panel_name: 'BotConfig',
    field_name: 'SPREADSHEET_ID'
  });
  
  if (!spreadsheetId) return;

  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;

  HTTP.get({
    url: url,
    // Calls the same command with sheet name as a parameter
    success: `${command.name} ${sheetName}`
  });
}

/**
 * Handles the response when a sheet is fetched.
 */
if (content) {
  Bot.sendMessage(`✅ Sheet fetched successfully: ${params}`);

  // Parse CSV content into row objects
  // NOTE: The following functions are defined in the master command "@" and available globally in this script:
  //   - parseCsv()
  //   - parseLessons()
  //   - parseQuizzes()
  //   - parseMeta()
  //   - validateImportedData()
  const rows = parseCsv(content);

  // Choose the appropriate parser based on sheet name
  let parsedData;
  switch (params) {
    case 'Lessons':
      parsedData = parseLessons(rows);
      break;
    case 'Quizzes':
      parsedData = parseQuizzes(rows);
      break;
    case 'Meta':
      parsedData = parseMeta(rows);
      break;
    default:
      throw new Error(`⚠️ Unknown sheet: ${params}`);
      return;
  }
  
  // Validate parsed data before saving
  validateImportedData(params, parsedData);

  // Save parsed data into bot storage
  Bot.setProp({
    name: params,
    value: parsedData,
    type: 'json'
  });

  return;
}

/**
 * Fetches all sheets and parses them.
 */
function fetchAllSheets() {
  const sheetNames = ['Meta', 'Lessons', 'Quizzes'];
  for (const name of sheetNames) {
    fetchSheet(name);
  }
}

// Start fetching all sheets
fetchAllSheets();

