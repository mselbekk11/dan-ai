import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { supabase } from '../../../lib/supabaseClient';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model =
  'mselbekk11/dun:9aa47d7eb714e4b9618be7da4409f85d74602dc5102e36e9eeba6f8c7cc040da';

export async function POST(request) {
  console.log('API route started');
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set');
    }

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
      throw new Error('Unexpected output format from Replicate');
    }

    console.log('Attempting to save images to Supabase');
    const imagesToInsert = output.map((url) => ({ url, prompt }));
    console.log('Data to insert:', imagesToInsert);

    const { data, error: supabaseError } = await supabase
      .from('images')
      .insert(imagesToInsert);

    if (supabaseError) {
      console.error(
        'Supabase error details:',
        JSON.stringify(supabaseError, null, 2)
      );
      throw new Error(
        `Failed to save images to database: ${
          supabaseError.message || 'Unknown error'
        }`
      );
    }

    console.log('Images saved successfully');
    return NextResponse.json(output);
  } catch (error) {
    console.error('Detailed error in API route:', error);
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
