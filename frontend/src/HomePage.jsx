import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard.jsx';

const API_URL = 'http://localhost:5000'; // Backend URL. 

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => { //useeffect untuk lakukan dan cek semua dibawah ketika halaman load
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch post dari url dibawah. tidak perlu menspesifik method GET karena by default GET
    setIsLoading(true);
    fetch(`${API_URL}/api/posts`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to load posts. Please try again.');
        setIsLoading(false);
        console.error('Error fetching posts:', err);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Postingan</h1>
        {isLoggedIn ? (
          <Link 
            to="/create-post" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
          >
            Buat Postingan Baru
          </Link>
        ) : (
          <Link 
            to="/login" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
          >
            Login untuk Posting
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">No posts found. Be the first to create one!</div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default HomePage;