import { pipeline, env } from "@xenova/transformers";

// Force WASM-only — no native binaries, works on Vercel serverless
env.backends.onnx.wasm.numThreads = 1;
env.allowLocalModels = false;

const MODEL_ID = "Xenova/all-MiniLM-L6-v2"; // 384-dim, WASM-only, no .so needed

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
    loadError = err instanceof Error ? err.message : "Failed to load MiniLM";
    throw new Error(loadError);
  }
}

/** MiniLM embedding with mean pooling + L2 normalize (cosine-ready, 384-dim) */
export async function embedText(text: string): Promise<number[]> {
  const model = await getExtractor();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export function getModelId(): string {
  return MODEL_ID;
}
