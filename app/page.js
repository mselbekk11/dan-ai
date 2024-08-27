'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);

  const generateImages = async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const newImages = await response.json();
    setImages(newImages);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-4xl font-bold mb-8'>MORGAN AI</h1>
      {/* <h2 className='text-2xl font-bold mb-8'>Start the prompt with "Images of TOK". TOK is used as a pointer to Morgan. The AI needs a non Engligh word to </h2> */}
      <div className='w-full max-w-xs mb-8'>
        <input
          type='text'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter your prompt here'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
      </div>
      <button
        onClick={generateImages}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Generate Images
      </button>
      <div className='grid grid-cols-2 gap-4 mt-8'>
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            src={imageUrl}
            alt={`Generated image ${index + 1}`}
            width={300}
            height={300}
          />
        ))}
      </div>
    </main>
  );
}
