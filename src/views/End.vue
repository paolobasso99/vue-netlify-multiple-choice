<template>
  <div id="end" class="container">
    <b-loading :is-full-page="true" :active="!pointsLoaded"></b-loading>

    <div v-if="pointsLoaded">
      <div class="has-text-centered notification is-primary">
        <p class="is-size-1">{{points.toFixed(2)}} in {{timeToString(totalTime)}}</p>
        <p class="is-size-7">On viewed questions only</p>
      </div>

      <h2 class="subtitle" v-if="incorrectQuestions.length > 0">Wrong answers</h2>
      <div v-for="(question, j) in incorrectQuestions" :key="j">
        <p class="has-text-weight-bold">{{ question.number + ". " + question.title }}</p>
        <div class="list-item control" v-for="(answer, i) in question.answers" v-bind:key="i">
          <label class="radio">
            <b-radio
              v-if="question.type == 'single'"
              v-model="question.selectedAnswers"
              :native-value="i"
              :name="question.number"
              :type="answer.isCorrect ? 'is-success' : (answer.isSelected ? 'is-danger' : '')"
              disabled
            />
            <b-checkbox
              v-if="question.type == 'multiple'"
              v-model="question.selectedAnswers"
              :native-value="i"
              :name="question.number"
              :type="answer.isCorrect ? 'is-success' : (answer.isSelected ? 'is-danger' : '')"
              disabled
            />
            <span
              :class="[
              answer.isCorrect ? 'has-text-success' : '',
              !answer.isCorrect && answer.isSelected ? 'has-text-danger' : ''
            ]"
              style="display: inline-block; margin-top: -15px; vertical-align: middle;"
            >{{ answer.text }}</span>
          </label>
        </div>
      </div>

      <h2 class="subtitle" style="margin-top: 4rem">Start another quiz</h2>
      <Launcher />
    </div>
  </div>
</template>

<script>
import router from "@/router";
import Launcher from "@/views/Launcher";

export default {
  name: "end",

  props: {
    questions: Array,
    timeToString: Function,
    totalTime: Number
  },

  components: {
    Launcher
  },

  data: function() {
    return {
      pointsLoaded: false,
      viewed: 0,
      correct: 0,
      incorrect: 0,
      unaswered: 0,
      points: 0,
      incorrectQuestions: []
    };
  },

  methods: {
    isAnswerSelected(question, answerIndex) {
      if (question.selectedAnswers.length > 1) {
        for (let i in question.selectedAnswers) {
          if (answerIndex == question.selectedAnswers[i]) return true;
        }

        return false;
      } else {
        return answerIndex == question.selectedAnswers;
      }
    }
  },

  mounted: function() {
    // Check answers
    for (let question of this.questions) {
      if (question.viewed) {
        this.viewed++;

        // Check if it has been answered
        if (question.selectedAnswers.length == 0) {
          this.unaswered++;
          this.incorrectQuestions.push(question);
          question.isCorrect = false;
        } else {
          for (let i in question.answers) {
            // Is the answer selected?
            question.answers[i].isSelected = this.isAnswerSelected(question, i);

            if (question.answers[i].isCorrect) {
              // Should be selected
              if (!question.answers[i].isSelected) question.isCorrect = false;
            } else {
              // Should not be selected
              if (question.answers[i].isSelected) question.isCorrect = false;
            }
          }

          if (question.isCorrect) {
            this.correct++;
          } else {
            this.incorrect++;
            this.incorrectQuestions.push(question);
          }
        }
      }
    }

    // Order incorrectQuestions
    this.incorrectQuestions.sort((a, b) => {
      let comparison = 0;
      if (a.number > b.number) {
        comparison = 1;
      } else {
        comparison = -1;
      }
      return comparison;
    });

    // Calculate points
    this.points =
      process.env.VUE_APP_WEIGHT_CORRECT * this.correct +
      process.env.VUE_APP_WEIGHT_INCORRECT * this.incorrect +
      process.env.VUE_APP_WEIGHT_UNANSWERED * this.unaswered;

    // Display
    this.pointsLoaded = true;
  }
};
</script>