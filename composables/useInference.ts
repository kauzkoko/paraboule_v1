import { InferenceEngine, CVImage } from "inferencejs";
const inferEngine = new InferenceEngine();

export async function useInference() {
  const store = useProtoStore();
  const { modelLoaded, modelWorkerId } = storeToRefs(store);

  async function predictFromImage(outputImage: any) {
    const image = new CVImage(outputImage);
    let predictions = await inferEngine.infer(modelWorkerId.value, image);
    return predictions;
  }

  async function startWorker() {
    if (modelWorkerId.value) {
      await inferEngine.stopWorker(modelWorkerId.value);
    }
    modelWorkerId.value = await inferEngine.startWorker(
      store.yoloModelCycler.state.name,
      store.yoloModelCycler.state.id,
      store.yoloModelCycler.state.modelId
    );
    // console.log("model has loaded", modelWorkerId.value);
    modelLoaded.value = true;
  }

  async function stopWorker() {
    // console.log("stopping worker", modelWorkerId.value);
    if (modelWorkerId.value) {
      await inferEngine.stopWorker(modelWorkerId.value);
      modelWorkerId.value = null;
      modelLoaded.value = false;
    }
  }

  return { predictFromImage, stopWorker, startWorker };
}
