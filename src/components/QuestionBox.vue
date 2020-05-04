<template>
  <div>
    <h2 v-if="!isEnd" class="subtitle" v-html="question.title"></h2>
    <p v-if="isEnd" class="has-text-weight-bold">
      <span>{{question.number + ". "}}</span>
      <span v-html="question.title"></span>
    </p>

    <div class="answers-container">
      <div class="list-item" v-for="(answer, i) in question.answers" v-bind:key="i">
        <div class="has-text-centered">
          <div class="control">
            <label class="radio columns is-mobile">
              <b-radio
                v-if="question.type == 'single'"
                v-model="question.selectedAnswers"
                :native-value="i"
                :name="question.number"
                :selected="question.selectedAnswers==i"
                :key="question.number"
                class="column is-narrow"
                :disabled="isEnd"
                :type="isEnd && answer.isCorrect ? 'is-success' : (answer.isSelected ? 'is-danger' : '')"
              />
              <b-checkbox
                v-if="question.type == 'multiple'"
                v-model="question.selectedAnswers"
                class="column is-narrow"
                :native-value="i"
                :name="question.number"
                :key="question.number"
                :disabled="isEnd"
                :type="isEnd && answer.isCorrect ? 'is-success' : (answer.isSelected ? 'is-danger' : '')"
              />
              <span
                :class="[
                  'column',
                  isEnd && answer.isCorrect ? 'has-text-success' : '',
                  isEnd && !answer.isCorrect && answer.isSelected ? 'has-text-danger' : ''
                ]"
                v-html="answer.text"
              ></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.answers-container {
  margin-bottom: 20px;
}
</style>

<script>
export default {
  props: {
    question: Object,
    isEnd: Boolean
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