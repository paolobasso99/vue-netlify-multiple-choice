<template>
  <div>
    <h2 class="subtitle">{{ question.title }}</h2>

    <div class="answers-container">
      <div class="list-item" v-for="(answer, i) in question.answers" v-bind:key="i">
        <div class="has-text-centered">
          <div class="control">
            <label class="radio">
              <b-radio
                v-if="question.type == 'single'"
                v-model="question.selectedAnswers"
                :native-value="i"
                :name="question.number"
                :selected="question.selectedAnswers==i"
                :key="question.number"
              />
              <b-checkbox
                v-if="question.type == 'multiple'"
                v-model="question.selectedAnswers"
                :native-value="i"
                :name="question.number"
                :key="question.number"
              />
              <span
                style="display: inline-block; margin-top: -15px; vertical-align: middle;"
              >{{ answer.text }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object
  },

  methods: {
    init() {
      if (!this.question.viewed) {
        // Set type
        let corrects = 0;
        for (let i in this.question.answers) {
          if (this.question.answers[i].isCorrect) corrects++;
        }

        if (corrects == 1) {
          this.question.type = "single";
        } else if (corrects > 1) {
          this.question.type = "multiple";
        }

        // Mark as viewed
        this.question.viewed = true;
      }
    }
  },

  mounted() {
    this.init();
  },

  updated() {
    this.init();
  }
};
</script>