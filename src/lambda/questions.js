import Tabletop from "tabletop";
import _arrayShuffle from "lodash/shuffle";
import _sampleSize from "lodash/sampleSize";
import striptags from "striptags";

const processText = (text) => {
  text = text.toString().trim();

  // Strip HTML tags
  text = striptags(text);

  // Detect and format links
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  text = text.replace(urlRegex, (url) => {
    return '<a href="' + url + '" target="_blank">' + url + "</a>";
  });

  return text;
};

export async function handler(event, context, callback) {
  const questions = [];

  try {
    // Get sheet
    const sheet = await Tabletop.init({
      key: process.env.VUE_APP_SPREADSHEET_URL,
      simpleSheet: true,
    });

    // Get answered questions
    let row = 0;
    while (row < sheet.length && sheet[row].question.length > 0) {
      // Check if it is a question title (there must be a number)
      if (sheet[row].number.length > 0) {
        const question = {
          number: sheet[row].number,
          title: processText(sheet[row].question),
          viewed: false,
          type: "",
          answers: [],
          isCorrect: true,
          selectedAnswers: [],
        };

        // Get answers
        row++;
        while (row < sheet.length && sheet[row].number.length == 0) {
          const answer = {
            text: processText(sheet[row].question),
            isCorrect: sheet[row].answer.toLowerCase() == "true" ? true : false,
          };

          question.answers.push(answer);

          row++;
        }

        // Shuffle answers
        question.answers = _arrayShuffle(question.answers);

        // Add question to array
        questions.push(question);
      }
    }
  } catch (e) {
    console.error(e, e.stack);
  }

  // Determinate how many questions
  let { howMany } = event.queryStringParameters;
  howMany = parseInt(howMany);
  if (isNaN(howMany) || howMany < 1) {
    howMany = questions.length;
  }

  // Return shufled questions of the right ammount
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(_sampleSize(questions, howMany)),
  });
}
