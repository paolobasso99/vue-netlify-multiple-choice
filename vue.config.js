// Default env vars
process.env.VUE_APP_NAME =
  process.env.VUE_APP_NAME || "Vue Netlify Multiple choice";
process.env.VUE_APP_MAINTEANCE = process.env.VUE_APP_MAINTEANCE || false;
process.env.VUE_APP_WEIGHT_CORRECT = process.env.VUE_APP_WEIGHT_CORRECT || 1;
process.env.VUE_APP_WEIGHT_INCORRECT =
  process.env.VUE_APP_WEIGHT_INCORRECT || -0.5;
process.env.VUE_APP_WEIGHT_UNANSWERED = process.env.VUE_APP_WEIGHT_UNANSWERED || 0;

module.exports = {};
