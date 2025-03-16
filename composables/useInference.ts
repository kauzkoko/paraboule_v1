import { InferenceEngine, CVImage } from "inferencejs";

export async function useInference() {
  const inferEngine = new InferenceEngine();
  let modelWorkerId = ref(null);

  modelWorkerId.value = await inferEngine.startWorker(
    "bolobolo",
    "14",
    "rf_li9xBZWuL5cSB9B343OFn9GGqpF2"
  );
  console.log("model has loaded", modelWorkerId.value);

  async function predictFromImage(outputImage: any) {
    let predictions = modelWorkerId.value;
    const image = new CVImage(outputImage);
    predictions = await inferEngine.infer(modelWorkerId.value, image);
    return predictions;
  }

  return { modelWorkerId, predictFromImage };
}
