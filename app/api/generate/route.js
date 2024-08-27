import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model =
  'mselbekk11/mog:d2592d585156ab8e4e0750f228a7f91f6f1c523ce478c2e21aa456aea4ed4e73';

export async function POST(request) {
  console.log('API route started');
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);

    const input = {
      width: 1024,
      height: 1024,
      prompt: prompt,
      refine: 'no_refiner',
      scheduler: 'K_EULER',
      lora_scale: 0.6,
      num_outputs: 4,
      guidance_scale: 7.5,
      apply_watermark: true,
      high_noise_frac: 0.8,
      negative_prompt: '',
      prompt_strength: 0.8,
      num_inference_steps: 50,
    };

    console.log('Using model:', model);
    console.log('With input:', input);

    console.log('Running Replicate...');
    const output = await replicate.run(model, { input });
    console.log('Replicate finished. Output:', output);

    if (!Array.isArray(output)) {
      console.error('Unexpected output format:', output);
      throw new Error('Unexpected output format');
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating images' },
      { status: 500 }
    );
  }
}