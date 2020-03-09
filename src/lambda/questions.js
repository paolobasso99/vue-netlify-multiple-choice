import Tabletop from 'tabletop';

export async function handler (event, context, callback) {

  // Get sheet
  const sheet = await Tabletop.init({
    key: process.env.VUE_APP_SPREADSHEET_URL,
    simpleSheet: true
  });

  // Filter completly answered questions
  const filtered = [];
  let i = 0;
  while(i<sheet.length) {
    let keep = true;
    let lastIndex = i+4;
    let firstIndex = i;

    // Check if question is present
    if(sheet[firstIndex].text == "") {
      i+=4;
      keep=false
    } else {
      // Check if it has all the answers
      while(++i <= lastIndex) {
        let answer = sheet[i].answer.toLowerCase();
        if(answer != 'true' && answer != 'false') {
          keep = false;
          i=lastIndex;
        }
      }
    }

    if(keep) {
      for(let j = firstIndex; j <= lastIndex; j++) {
        filtered.push(sheet[j]);
      }
    }
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(filtered)
  })
}