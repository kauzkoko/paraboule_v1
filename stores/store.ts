export const useProtoStore = defineStore("protoStore", () => {
  const boules = ref([
    { id: 1, name: "Boule 1", color: "red" },
    { id: 2, name: "Boule 2", color: "blue" },
    { id: 3, name: "Boule 3", color: "green" },
  ]);

  const boulesStepper = useStepper(boules.value);

  return {
    boules,
    boulesStepper
  };
});
