<template>
  <div id="quiz" class="container">
    <b-loading :is-full-page="true" :active="!questionsLoaded"></b-loading>

    <div v-if="questionsLoaded">
      <QuestionBox :question="questions[index]" />

      <QuestionNav
        :questions="questions"
        :index="index"
        :next="next"
        :submit="submit"
        :time="time"
        :goTo="goTo"
        :timeToString="timeToString"
      />
    </div>
  </div>
</template>

<script>
import Tabletop from "tabletop";
import QuestionBox from "@/components/QuestionBox";
import QuestionNav from "@/components/QuestionNav";
import router from "@/router";
import _sampleSize from "lodash/sampleSize";
import axios from "axios";

export default {
  name: "quiz",

  components: {
    QuestionBox,
    QuestionNav
  },

  props: {
    howMany: Number
  },

  data: function() {
    return {
      questionsLoaded: false,
      questions: [],
      index: 0,
      time: 0
    };
  },

  methods: {
    toDoubleDigit: function(n) {
      if (n.toString().length < 2) {
        n = ("0" + n).slice(-2);
      }
      return n;
    },
    getMinutes: function(s) {
      return Math.floor(s / 60);
    },
    getSeconds: function(s) {
      return this.toDoubleDigit(s - this.getMinutes(s) * 60);
    },
    timeToString: function(s) {
      return this.toDoubleDigit(this.getMinutes(s)) + ":" + this.getSeconds(s);
    },
    next: function() {
      // Go to next
      if (this.index + 1 < this.howMany) {
        this.index++;
      }
    },
    submit: function(totalTime) {
      router.push({
        name: "end",
        params: {
          questions: this.questions,
          totalTime: totalTime,
          timeToString: this.timeToString
        },
        query: {
          key: this.$route.query.key
        }
      });
    },
    goTo: function(i) {
      // Set answered
      this.questions[this.index].answered = true;

      // Go to next
      if (i < this.howMany) {
        //this.index = i;
      }
    },
    startTimer: function() {
      this.time = 0;
      let interval = window.setInterval(() => {
        this.time++;
      }, 1000);
    }
  },

  mounted: async function() {
    // Get questions
    const questions = await axios.get("/.netlify/functions/questions");

    if (typeof questions.data == "undefined" || questions.data.length == 0) {
      throw "Unable to get questions from the server.";
    } else {
      // Build question arrays
      const pickedQuestionsIndexes = _sampleSize(
        [...Array(questions.data.length).keys()],
        this.howMany
      );

      for (let q of pickedQuestionsIndexes) {
        this.questions.push(questions.data[q]);
      }

      // Render quiz
      this.questionsLoaded = true;

      // Start timer
      this.startTimer();
    }
  }
};
</script>