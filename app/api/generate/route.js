import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model =
  'mselbekk11/app:477476670e29abcc195daf5f5546eb8ea79ae4f759a1abf922a241723fdd91ef';

export async function POST(request) {
  const { prompt } = await request.json();
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

  try {
    console.log('Using model:', model);
    console.log('With input:', input);

    console.log('Running...');
    const output = await replicate.run(model, { input });
    console.log('Done!', output);

    return NextResponse.json(output);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating images' },
      { status: 500 }
    );
  }
}
