import { InferenceEngine, CVImage } from "inferencejs";

export async function useInference() {
  const store = useProtoStore();
  const { modelLoaded } = storeToRefs(store);

  const inferEngine = new InferenceEngine();
  let modelWorkerId = ref(null);

  modelWorkerId.value = await inferEngine.startWorker(
    "bolobolo",
    "20",
    "rf_li9xBZWuL5cSB9B343OFn9GGqpF2"
  );
  console.log("model has loaded", modelWorkerId.value);
  modelLoaded.value = true;

  async function predictFromImage(outputImage: any) {
    let predictions = modelWorkerId.value;
    const image = new CVImage(outputImage);
    predictions = await inferEngine.infer(modelWorkerId.value, image);
    return predictions;
  }

  return { modelWorkerId, predictFromImage };
}
