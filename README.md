# Vue Netlify Multiple choice
[![Netlify Status](https://api.netlify.com/api/v1/badges/5121185d-10ab-4cc6-93a1-e4aed0557da1/deploy-status)](https://app.netlify.com/sites/quiz-controlli/deploys)

![Demo](https://i.imgur.com/eys00z6.gifv)

This is a simple Vue.js sigle web app that takes multiple choice questions from a Google Sheet and display them randomly.
It uses a Netlify Cloud function in order to get the questions.

**You can see and example [here](https://quiz-controlli.bassopaolo.com/)**.

## Why?
Some exams at my university have a part which contains multiple choice questions (especially during the COVID pandemic!) so I have bult this app to exercise for those parts using questions written by myself or questions found in past exams. I decided to use Google Sheets to store these questions because the ease of use.

## What did I learn
1. **Vue.js**: while simple, this app has been a great intoduction to Vue.js 
2. **Netlify Functions**: I decided to use a Lambda Function to get the data from the sheet, in particular I used Netlify Cloud Functions, because I did not want to use my server to deploy this app.

## Google Sheet setup
### Sheet Layout
The sheet must have a specific layout.
There must be these columns: number, question, answer.

- "number" is an index that starsts from 0
- "question" contains the questions and answers
- "answer" contains if the relative answer is true or false (Tip: you can use checkboxes!).

#### Example

| number | question                                          | answer |
| ------ | ------------------------------------------------- | ------ |
| 0      | 2+1=?                                             |        |
|        | 1                                                 | false  |
|        | 2                                                 | false  |
|        | 3                                                 | true   |
|        | 4                                                 | false  |
| 1      | What to primary colors produce yellow when mixed? |        |
|        | Red                                               | true   |
|        | Green                                             | true   |
|        | Blue                                              | false  |

### Sheet URL
1. `Publish to the web` (`File > Publish to the web`) your sheet as a `Web page`.
2. Get sharable link to put in the `VUE_APP_SPREADSHEET_URL` env var by doing `Share > Get sharable link`

## Local project setup
1. Install dependencies:
```
npm install
```
2. Edit Envirorment variables creating an `.env` file, you can find the possible variables [here](#envirorment-variables).
3. Run the local server:
```
npm run serve
```

## Envirorment variables
| Variable                    | required | default                       |
| --------------------------- | -------- | ----------------------------- |
| `VUE_APP_SPREADSHEET_URL`   | Yes      | None                          |
| `VUE_APP_NAME`              | No       | "Vue Netlify Multiple choice" |
| `VUE_APP_WEIGHT_CORRECT`    | No       | 1                             |
| `VUE_APP_WEIGHT_INCORRECT`  | No       | -0.5                          |
| `VUE_APP_WEIGHT_UNANSWERED` | No       | 0                             |

