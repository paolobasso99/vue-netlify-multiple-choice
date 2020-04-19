import Tabletop from "tabletop";
import _arrayShuffle from "lodash/shuffle";

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
          title: sheet[row].question,
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
            text: sheet[row].question,
            isCorrect: sheet[row].answer.toLowerCase() == "true" ? true : false
          };

          question.answers.push(answer);

          row++;
        }

        // Shuffle answers
        question.answers = _arrayShuffle(question.answers);

        questions.push(question);
      }
    }
  } catch (e) {
    console.error(e, e.stack);
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(questions),
  });
}
