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
import axios from "axios";

export default {
  name: "quiz",

  components: {
    QuestionBox,
    QuestionNav
  },

  props: {
    howMany: String
  },

  data: function() {
    return {
      questionsLoaded: false,
      numberOfQuestions: "all",
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
      if (this.index + 1 < this.numberOfQuestions) {
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
        }
      });
    },
    goTo: function(i) {
      if (i < this.numberOfQuestions) {
        this.index = i;
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
    // Determinate how many questions
    if (this.howMany != "all") {
      this.numberOfQuestions = parseInt(this.howMany);
      if (isNaN(this.numberOfQuestions) || this.numberOfQuestions < 1) {
        return router.push({
          name: "quiz",
          params: {
            howMany: "all"
          }
        });
      }
    }

    // Get questions
    const questions = await axios.get("/.netlify/functions/questions", {
      params: { howMany: this.numberOfQuestions }
    });

    if (typeof questions.data == "undefined" || questions.data.length == 0) {
      throw "Unable to get questions from the server.";
    } else {
      // Handle "all"
      if (this.numberOfQuestions == "all") {
        this.numberOfQuestions = questions.data.length;
      }

      // Build question arrays
      this.questions = questions.data;

      // Render quiz
      this.questionsLoaded = true;

      // Start timer
      this.startTimer();
    }
  }
};
</script>