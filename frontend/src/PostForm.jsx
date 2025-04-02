import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; 

const PostForm = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      fetch(`${API_URL}/api/posts/${id}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch post');
          return response.json();
        })
        .then(data => {
          setContent(data.content);
          setIsLoading(false);
        })
        .catch(err => {
          setError('Failed to load post. Please try again.');
          setIsLoading(false);
          console.error('Error fetching post:', err);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You need to be logged in to create a post');
        setIsLoading(false);
        return;
      }

      const url = isEditMode 
        ? `${API_URL}/api/posts/${id}`
        : `${API_URL}/api/posts`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Error saving post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Menyimpan...' : isEditMode ? 'Update Post' : 'Buat Postingan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;