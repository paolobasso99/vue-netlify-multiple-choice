<template>
  <div id="end" class="container">
    <b-loading :is-full-page="true" :active="!pointsLoaded"></b-loading>

    <div v-if="pointsLoaded">
      <div class="has-text-centered notification is-primary">
        <p class="is-size-1">{{points.toFixed(2)}} in {{timeToString(totalTime)}}</p>
        <p
          class="is-size-5"
        >{{corrects}} corrects, {{incorrects}} incorrects and {{unaswered}} unaswered</p>
        <p class="is-size-7">On viewed questions only</p>
      </div>

      <h2 class="subtitle" v-if="incorrectQuestions.length > 0">Wrong answers</h2>
      <div v-for="(question, j) in incorrectQuestions" :key="j">
        <QuestionBox :question="question" :isEnd="true" />
      </div>

      <h2 class="subtitle" style="margin-top: 4rem">Start another quiz</h2>
      <Launcher />
    </div>
  </div>
</template>

<script>
import router from "@/router";
import QuestionBox from "@/components/QuestionBox";
import Launcher from "@/views/Launcher";

export default {
  name: "end",

  props: {
    questions: Array,
    timeToString: Function,
    totalTime: Number
  },

  components: {
    Launcher,
    QuestionBox
  },

  data: function() {
    return {
      pointsLoaded: false,
      viewed: 0,
      corrects: 0,
      incorrects: 0,
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
            this.corrects++;
          } else {
            this.incorrects++;
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
      parseFloat(process.env.VUE_APP_WEIGHT_CORRECT) * this.corrects +
      parseFloat(process.env.VUE_APP_WEIGHT_INCORRECT) * this.incorrects +
      parseFloat(process.env.VUE_APP_WEIGHT_UNANSWERED) * this.unaswered;

    // Display
    this.pointsLoaded = true;
  }
};
</script>