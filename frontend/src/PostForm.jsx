import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build your post data payload
    const postData = { title, content };
  
    try {
      // Make a POST request to the backend endpoint
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
  
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        console.error('Error creating post:', response.statusText);
        return; // Optionally, set some error state here
      }
  
      // Optionally, parse the JSON response if needed
      const data = await response.json();
      console.log('Post created successfully:', data);
  
      // Navigate to the home page or any other route after a successful submission
      navigate('/');
    } catch (error) {
      console.error('Error connecting to the API:', error);
      // Optionally, set some error state here to display an error message to the user
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Judul Postingan
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan judul postingan"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Isi Postingan
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tulis postingan Anda di sini"
            rows="4"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
          >
            Buat Postingan
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;