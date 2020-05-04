<template>
  <div class="columns">
    <div class="column is-4 has-text-centered">
      <button class="button is-success" @click="submit(time)">Submit</button>
      <button
        class="button is-primary"
        @click="next"
        style="margin-left: 0.5rem;"
        v-if="index +1 < questions.length"
      >Next</button>
    </div>

    <div class="column is-1 has-text-centered">
      <div id="timer" class="has-text-weight-bold">{{timeToString(time)}}</div>
    </div>

    <div class="column is-7">
      <nav
        id="questions-pagination"
        class="pagination is-small"
        role="navigation"
        aria-label="pagination"
      >
        <ul class="pagination-list">
          <li v-for="(q, i) in questions" v-bind:key="i+1">
            <a
              class="pagination-link"
              @click="goTo(i)"
              :class="{
                'is-current': i==index,
                'has-text-light has-background-grey': isQuestionAnswered(questions[i]) && i!=index
              }"
            >{{ i+1 }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questions: Array,
    index: Number,
    next: Function,
    submit: Function,
    time: Number,
    timeToString: Function,
    goTo: Function
  },

  methods: {
    isQuestionAnswered(question) {
      if (Array.isArray(question.selectedAnswers)) {
        return question.selectedAnswers.length > 0;
      }
      return true;
    }
  }
};
</script>