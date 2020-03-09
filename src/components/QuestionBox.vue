<template>
  <div>
    <h2 class="subtitle">{{ question.title }}</h2>

    <div class="list-item" v-for="(q, i) in this.question.sub" v-bind:key="q+'-'+i">
      <div class="has-text-centered">
        <div class="control">
          <label class="radio">
            <input
              v-model="q.answer"
              type="radio"
              :value="i"
              :name="question.number + '-' + i"
            />
            {{ q.text }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object
  }
};
</script>