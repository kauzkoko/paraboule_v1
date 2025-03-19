<template>
  <div class="fullScreenAll bg-white pl-5" v-if="!submitted">
    <h1>Poll</h1>
    <div>
      <h2>Boules constellation {{ state.id }}</h2>
      <p class="pr-5">{{ state.question }}</p>
      <div>
        <div class="flex flex-wrap flex-row">
          <div
            v-for="option in state.options"
            :key="option.id"
            class="relative"
          >
            <img
              :src="`/images/poll/${state.id}/${option.id}.png`"
              :alt="`constellation${option.id}`"
              class="w-30vw aspect-1 object-cover"
            />
            <div
              class="absolute top-2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
            >
              {{ option.id }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label
          v-for="option in state.options"
          :key="option.id"
          class="flex items-center cursor-pointer"
        >
          <input
            type="radio"
            class="sr-only peer"
            :value="option.id"
            :name="'question-' + state.id"
            v-model="selectedAnswers[index].answer"
          />
          <div
            class="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center mr-4 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:text-white"
          >
            {{ option.id }}
          </div>
          <span class="text-xl">{{ option.label }}</span>
        </label>
      </div>

      <div class="flex flex-col gap-4 max-w-80vw justify-left items-left">
        <div class="flex justify-between items-center mt-8 w-80vw">
          <button
            v-if="index > 0"
            @click="prev()"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Previous
          </button>
          <div v-else class="w-20"></div>
          <button
            v-if="index < questions.length - 1"
            @click="next()"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
          <div v-else class="w-20"></div>
        </div>
        <div>
          <button
            @click="submit()"
            :disabled="selectedAnswers.some((answer) => !answer.answer)"
            class="mt-8 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="fullScreenAll bg-white flexCenter flex-col">
    <div>
      <h1 class="text-center">Thank you for your answers!</h1>
    </div>
    <div>Your ID is {{ id }}</div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

const questions = [
  {
    id: 1,
    question:
      "Which positions of the boules match what you heard in the ambisonics experience?",
    options: [
      { id: 1, label: "Constellation 1", image: "/images/poll/1/1.png" },
      { id: 2, label: "Constellation 2", image: "/images/poll/1/2.png" },
      { id: 3, label: "Constellation 3", image: "/images/poll/1/3.png" },
    ],
  },
  {
    id: 2,
    question:
      "Which positions of the boules match what you heard in the ambisonics experience?",
    options: [
      { id: 1, label: "Constellation 1", image: "/images/poll/2/1.png" },
      { id: 2, label: "Constellation 2", image: "/images/poll/2/2.png" },
      { id: 3, label: "Constellation 3", image: "/images/poll/2/3.png" },
    ],
  },
  {
    id: 3,
    question:
      "Which positions of the boules match what you heard in the ambisonics experience?",
    options: [
      { id: 1, label: "Constellation 1", image: "/images/poll/3/1.png" },
      { id: 2, label: "Constellation 2", image: "/images/poll/3/2.png" },
      { id: 3, label: "Constellation 3", image: "/images/poll/3/3.png" },
    ],
  },
  {
    id: 4,
    question:
      "Which positions of the boules match what you heard in the ambisonics experience?",
    options: [
      { id: 1, label: "Constellation 1", image: "/images/poll/4/1.png" },
      { id: 2, label: "Constellation 2", image: "/images/poll/4/2.png" },
      { id: 3, label: "Constellation 3", image: "/images/poll/4/3.png" },
    ],
  },
  {
    id: 5,
    question:
      "Which positions of the boules match what you heard in the ambisonics experience?",
    options: [
      { id: 1, label: "Constellation 1", image: "/images/poll/5/1.png" },
      { id: 2, label: "Constellation 2", image: "/images/poll/5/2.png" },
      { id: 3, label: "Constellation 3", image: "/images/poll/5/3.png" },
    ],
  },
];
const { index, state, next, prev } = useCycleList(questions);

const name = ref("");
const selectedAnswers = ref([
  {
    id: 1,
    answer: 0,
  },
  {
    id: 2,
    answer: 0,
  },
  {
    id: 3,
    answer: 0,
  },
  {
    id: 4,
    answer: 0,
  },
  {
    id: 5,
    answer: 0,
  },
]);
watch(
  selectedAnswers,
  (newVal) => {
    console.log(selectedAnswers.value[index.value].answer);
  },
  { deep: true }
);

const listOfNumberNames = [
  "AX3",
  "BX2",
  "CX1",
  "DX1",
  "EX2",
  "FX3",
  "GX3",
  "HX2",
  "IX1",
  "JX1",
  "KX2",
  "LX3",
  "MX3",
  "NX2",
  "OX1",
  "PX1",
  "QX2",
  "RX3",
  "SX3",
  "TX2",
  "UX1",
  "VX1",
  "WX2",
  "XX3",
  "YX2",
  "ZX1",
  "AY3",
  "BY2",
  "CY1",
  "DY1",
  "EY2",
  "FY3",
  "GY3",
  "HY2",
  "IY1",
  "JY1",
  "KY2",
  "LY3",
];

const id = ref(0);
const submitted = ref(false);
const submit = async () => {
  console.log(selectedAnswers.value);

  const { data, error } = await supabase
    .from("poll")
    .insert([
      {
        name: name.value ?? "Anonymous",
        step1: selectedAnswers.value[0].answer,
        step2: selectedAnswers.value[1].answer,
        step3: selectedAnswers.value[2].answer,
        step4: selectedAnswers.value[3].answer,
        step5: selectedAnswers.value[4].answer,
      },
    ])
    .select();

  if (error) {
    console.error(error);
  } else {
    console.log(data);
    id.value = data[0].id;
    submitted.value = true;
  }
};
</script>
