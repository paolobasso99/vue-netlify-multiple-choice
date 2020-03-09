<template>
	<div id="end" class="container">
		<div class="has-text-centered notification is-primary">
			<p class="is-size-1">
				{{score.toFixed(3)}} in {{timeToString(totalTime)}} (max {{timeToString(maxTime)}})
			</p>
			<p class="is-size-7">
				Rispetto alle sole domande a cui hai risposto
			</p>
		</div>
		<h2 class="subtitle" v-if="incorrectQuestions.length > 0">Risposte sbagliate</h2>

		<div v-for="(question, index) in incorrectQuestions" :key="index">
			<p class="has-text-weight-bold">{{ question.number + ". " + question.title }}</p>
			<div class="list-item" v-for="(s, i) in question.sub" v-bind:key="i">

				<p>{{ s.text }}</p>

				<div class="has-text-centered field is-grouped" style="margin-top: 0.5rem">
							<span class="tag control" :class="[
									s.correct=='true' ? 'is-success' : '',
									s.answer=='true' && s.correct!='true' ? 'is-danger' : ''
					]">Vero</span>
							<span class="tag control" :class="[
									s.correct=='false' ? 'is-success' : '',
									s.answer=='false' && s.correct!='false' ? 'is-danger' : ''
					]">Falso</span>
							<span class="tag control" :class="[
									s.answer=='notGiven' ? 'is-danger' : ''
					]">Non so</span>
				</div>
			</div>
		</div>

		<h2 class="subtitle" style="margin-top: 4rem">Inizia un altro quiz</h2>
		<Launcher />
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
import router from '@/router';
import Launcher from '@/views/Launcher';

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
			answered: 0,
			correct: 0,
			incorrect: 0,
			notGiven: 0,
			score: 0,
			incorrectQuestions: [],
			maxTime: 0
		}
	},
	mounted: function() {

		// Redirect if not completed the quiz
		if(typeof this.questions == "undefined" || this.questions.length == 0) {
			this.$router.push({
				name: "launcher",
        query: { 
					key: this.$route.query.key
				}
			});
		}

		for(let q of this.questions) {
			if(q.answered) {
				this.answered++;
				let isIncorrect = false;

				for(let s of q.sub) {
					if(s.answer == s.correct){ // Correct
						this.correct++;
					} else if(s.answer == 'notGiven') { // Not given
						this.notGiven++;
						isIncorrect = true;
					} else { // Wrong
						this.incorrect++;
						isIncorrect = true;
					}
				}

				// Add to incorrectQuestions to display
				if(isIncorrect) {
					this.incorrectQuestions.push(q);
				}
			}
		}

		// Order incorrectQuestions
		this.incorrectQuestions.sort((a, b) => {
			let comparison = 0;
			if(a.number > b.number) {
				comparison = 1;
			} else {
				comparison = -1;
			}
			return comparison;
		});

		// Calculate score
		this.score = 0.3*this.correct - 0.2*this.incorrect -0.1*this.notGiven; // Points
		this.score = 30*this.score / (this.answered); // Proportion 

		// Calculate max time
		this.maxTime = this.answered*60*4/3
	}
}
</script>