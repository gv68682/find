import { pipeline, env } from "@xenova/transformers";

env.cacheDir = ".cache/transformers";
env.allowLocalModels = true;

const MODEL_ID = "Xenova/bge-m3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractor: any = null;
let loadError: string | null = null;

async function getExtractor() {
  if (extractor) return extractor;
  if (loadError) throw new Error(loadError);

  try {
    extractor = await pipeline("feature-extraction", MODEL_ID, {
      quantized: true,
    });
    return extractor;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load BGE-M3";
    throw new Error(loadError);
  }
}

/** BGE-M3 embedding with mean pooling + L2 normalize (cosine-ready) */
export async function embedWithBgeM3(text: string): Promise<number[]> {
  const model = await getExtractor();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export function getModelId(): string {
  return MODEL_ID;
}
