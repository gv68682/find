export async function embedText(text: string): Promise<number[]> {
  try {
    const { pipeline, env } = await import("@huggingface/transformers");
    if (env.backends?.onnx?.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
    }
    env.allowLocalModels = false;
    const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await model(text, { pooling: "mean", normalize: true });
    return Array.from(output.data as Float32Array);
  } catch {
    return []; // falls back to lifestyle-only scoring in engine.ts
  }
}

export function getModelId(): string {
  return "Xenova/all-MiniLM-L6-v2";
}
