<template>
    <div  id="quiz" class="container">
        <b-loading :is-full-page="true" :active="!questionsLoaded"></b-loading>

        <div v-if="questionsLoaded">
            <QuestionBox
                :question="questions[index]"
            />

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
import Tabletop from 'tabletop';
import QuestionBox from '@/components/QuestionBox.vue';
import QuestionNav from '@/components/QuestionNav.vue';
import router from '@/router';
import _arrayShuffle from 'lodash/shuffle';
import _sampleSize from 'lodash/sampleSize';
import axios from 'axios';

export default {
  name: 'quiz',

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
    }
  },

  methods: {
    toDoubleDigit: function(n) {
      if(n.toString().length < 2){
        n = ("0" + n).slice(-2)
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
      return this.toDoubleDigit(this.getMinutes(s)) + ':' + this.getSeconds(s);
    },
    next: function() {
      // Set answered
      this.questions[this.index].answered = true;

      // Go to next
      if(this.index +1 < this.howMany) {
        this.index++;
      }
    },
    submit: function(totalTime) {
      // Set answered
      this.questions[this.index].answered = true;

      router.push({
        name: 'end',
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
      if(i < this.howMany) {
        //this.index = i;
      }
    },
    startTimer: function() {
      this.time = 0;
      let interval = window.setInterval(() => {
        this.time++;
      },1000);
    }
  },

  mounted: async function() {
    // Get questions
    const questions = await axios.get('/.netlify/functions/questions');

    // Build question arrays
    const numberOfQuestions = questions.data.length/5; // 5 rows per question
    const pickedQuestionsNumbers = _sampleSize([...Array(numberOfQuestions).keys()], this.howMany);

    for (let n of pickedQuestionsNumbers) {
      let i = n*5;

      // Build question object
      const question = {
        title: questions.data[i].text,
        answered: false,
        number: questions.data[i].number,
        sub: []
      }

      // Add the four sub questions
      for(; ++i < n*5 + 5;) { // Loop 4 subquestions
        question.sub.push({
          text: questions.data[i].text,
          answer: 'notGiven',
          correct: questions.data[i].answer.toLowerCase()
        });
      }

      // Shuffle questions
      question.sub=_arrayShuffle(question.sub);

      // Add to questions array
      this.questions.push(question);
    }

    // Render quiz
    this.questionsLoaded = true;

    // Start timer
    this.startTimer();
  }

}
</script>