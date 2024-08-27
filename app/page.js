'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImages = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Sending request to generate images');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const text = await response.text();
      console.log('Response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Server responded with status ${response.status}`
        );
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected data format:', data);
        throw new Error('Unexpected response format');
      }

      setImages(data);
    } catch (error) {
      console.error('Error generating images:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageUrl, index) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => console.error('Error downloading image'));
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-4 lg:p-12'>
      <h1 className='text-4xl font-bold mb-4 animate'>MORGAN AI</h1>

      <h3 className='text-sm font-bold mb-8'>
        This AI uses MOG as a reference to generate images, please start your
        prompt with &quot;A photo of MOG&quot;
      </h3>

      <div className='w-full max-w-2xl mb-8 lg:flex gap-4'>
        <input
          type='text'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='A photo of MOG dressed as a pig...'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        <button
          onClick={generateImages}
          disabled={isLoading}
          className='bg-gradient-to-r from-indigo-500 to-purple-500 rounded font-bold py-2 px-4 w-full lg:w-auto whitespace-nowrap flex-shrink-0 disabled:opacity-50 mt-4 lg:mt-0'
        >
          {isLoading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

      {isLoading && (
        <div className='text-center'>
          <div className='spinner mx-auto mb-4'></div>
          <p>Generating images...</p>
          <p>This may take 30-60 seconds</p>
        </div>
      )}

      {error && <div className='text-red-500 mb-4'>{error}</div>}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 max-w-2xl w-full'>
        {images.map((imageUrl, index) => (
          <div key={index} className='relative group w-full'>
            <Image
              src={imageUrl}
              alt={`Generated image ${index + 1}`}
              width={600}
              height={600}
              className='rounded-lg'
            />
            <button
              onClick={() => downloadImage(imageUrl, index)}
              className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
