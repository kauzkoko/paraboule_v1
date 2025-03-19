<template>
  <div class="fullScreenAll bg-white pl-5">
	<div>
		<h2>Correct answers</h2>
		<table class="border-collapse border border-slate-400 mb-5">
			<thead>
				<tr>
					<th>ID</th>
					<th>Step1</th>
					<th>Step2</th>
					<th>Step3</th>
					<th>Step4</th>
					<th>Step5</th>
				</tr>
			</thead>
			<tbody>
				<tr class="children:bg-green">
					<td>ekmek</td>
					<td>1</td>
					<td>1</td>
					<td>3</td>
					<td>1</td>
					<td>2</td>
				</tr>
			</tbody>
		</table>
		<h2>Poll results</h2>
		<table class="border-collapse border border-slate-400 mt-4">
			<thead>
				<tr>
					<th>ID</th>
					<th>Step1</th>
					<th>Step2</th>
					<th>Step3</th>
					<th>Step4</th>
					<th>Step5</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="poll in poll" :key="poll.id">
					<td :class="poll.name === 'ogi' || poll.name === 'ekmekt' ? 'bg-green-500' : 'bg-red-500'">{{ poll.id }}</td>
					<td :class="poll.step1 === 1 ? 'bg-green-500' : 'bg-red-500'">{{ poll.step1 }}</td>
					<td :class="poll.step2 === 1 ? 'bg-green-500' : 'bg-red-500'">{{ poll.step2 }}</td>
					<td :class="poll.step3 === 3 ? 'bg-green-500' : 'bg-red-500'">{{ poll.step3 }}</td>
					<td :class="poll.step4 === 1 ? 'bg-green-500' : 'bg-red-500'">{{ poll.step4 }}</td>
					<td :class="poll.step5 === 2 ? 'bg-green-500' : 'bg-red-500'">{{ poll.step5 }}</td>
				</tr>
			</tbody>
		</table>
	</div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();


let { data: poll, error } = await supabase
  .from('poll')
  .select('*')
          
if (error) {
  console.error("Error fetching polls:", error);
}
</script>

<style scoped>
td, th {
	padding: 0 5px;
	border-right: 1px solid #000;
	width: 10px;
}
</style>
