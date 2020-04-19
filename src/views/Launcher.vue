<template>
	<div  id="launcher"  class="container">
		<div class="control">

			<label class="list-item" v-for="n in defaultQuestions" :key="n">
				<input
					type="radio"
					name="number-questions"
					:value="n"
					:checked="n==selectedNumber"
					@change="selectedNumber=n"
					v-model="selectedNumber"
				>
				Quiz with {{ n }} questions
			</label>

			<label class="list-item">
				<input type="radio" name="number-questions" value="custom" v-model="selectedNumber">
				Quiz with <input type="number" v-model.number="customNumber"  min="1" @focus="selectedNumber = 'custom'"> questions
			</label>
		</div>

		<div class="container has-text-centered">
			<button class="button is-large is-primary" @click="startQuiz">Start Quiz</button>
		</div>
	</div>
</template>

<script>
import router from '@/router';

export default {
	name: 'launcher',
	data: function() {
    return {
			defaultQuestions: [10, 20, 30, 9999],
			selectedNumber: 30,
			customNumber: 30
		}
	},
	methods: {
		startQuiz: function() {
			router.push({
				name: 'quiz',
				params: { 
					howMany: this.selectedNumber == 'custom' ?  this.customNumber : this.selectedNumber
				}
			});
		}
	}
}
</script>