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
    console.log("Getting spreadsheet...");
    const spreadsheet = await Tabletop.init({
      key: process.env.VUE_APP_SPREADSHEET_URL,
      wanted: [process.env.VUE_APP_SHEET_NAME],
    });
    const sheet = spreadsheet[process.env.VUE_APP_SHEET_NAME].elements;
    console.log("Rows: " + sheet.length);

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
          img: null,
          answers: [],
          isCorrect: true,
          selectedAnswers: [],
        };

        // Img if present
        if (sheet[row].img.length > 0) {
          question.img = sheet[row].img;
        }

        // Get answers
        row++;
        let hasTrue = false;
        while (row < sheet.length && sheet[row].number.length == 0) {
          const answer = {
            text: processText(sheet[row].question),
            isCorrect: sheet[row].answer.toLowerCase() == "true" ? true : false,
          };

          if (answer.isCorrect) {
            hasTrue = true;
          }

          question.answers.push(answer);

          row++;
        }

        if (hasTrue) {
          // Shuffle answers
          question.answers = _arrayShuffle(question.answers);

          // Add question to array
          questions.push(question);
        }
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
  console.log("Possible questions: " + questions.length);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(_sampleSize(questions, howMany)),
  });
}
