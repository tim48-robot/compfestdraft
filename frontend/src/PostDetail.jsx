import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Likes from './Likes.jsx';
import Comments from './Comments.jsx';

const API_URL = 'http://localhost:5000';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isLoggedIn = !!localStorage.getItem('token');
  const currentUser = isLoggedIn ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/posts/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found');
        }
        throw new Error('Failed to fetch post');
      }
      
      const data = await response.json();
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
            {post.author?.username.charAt(0).toUpperCase()}
        </div>
        <div>
            <h3 className="font-bold">{post.author?.name || post.author?.username}</h3>
            <p className="text-gray-500 text-sm">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'just now'}
            </p>
        </div>
        </div>
        <div className="mb-6">
          <p className="text-lg">{post.content}</p>
        </div>
        
        <div className="flex items-center justify-between pb-4 border-b">
          <Likes post={post} />
          
          {currentUser && currentUser.id === post.author?.id && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-post/${post.id}`)}
                className="text-blue-500 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
        
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetail;