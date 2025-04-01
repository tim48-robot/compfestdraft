import React, { useState, useEffect } from 'react';

const LikeButton = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likesData, setLikesData] = useState([]); 
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    if (post && post.id) {
      fetchLikes();
    }
  }, [post?.id]);

  const fetchLikes = () => {
    fetch(`${API_URL}/api/likes/post/${post.id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch likes');
        return response.json();
      })
      .then(data => {
        setLikesData(data);
        setLikeCount(data.length);
        
        const token = localStorage.getItem('token');
        if (token) {

          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const currentUserId = tokenData.id;
            const userLiked = data.some(like => like.user.id === currentUserId);
            setIsLiked(userLiked);
          } catch (error) {
            console.error('Error processing token:', error);
          }
        }
        
        console.log('LIKES_DATA:', JSON.stringify(data));
      })
      .catch(err => {
        console.error('Error fetching likes:', err);
      });
  };

  const handleLikeToggle = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('You need to be logged in to like posts');
      return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

    if (newIsLiked) {
      fetch(`${API_URL}/api/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          postId: post.id 
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to like post');
        return response.json();
      })
      .then(data => {
        fetchLikes();
      })
      .catch(err => {
        setIsLiked(false);
        setLikeCount(prevCount => prevCount - 1);
        console.error('Error liking post:', err);
      });
    } else {
      fetch(`${API_URL}/api/likes/post/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to unlike post');
        return response.json();
      })
      .then(data => {
        fetchLikes();
      })
      .catch(err => {
        setIsLiked(true);
        setLikeCount(prevCount => prevCount + 1);
        console.error('Error unliking post:', err);
      });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleLikeToggle}
        className={`
          p-2 rounded-full transition-colors duration-200
          ${isLiked
            ? 'bg-red-500 text-white'  // If liked: red background
            : 'bg-gray-200 text-gray-700'  // If not liked: gray background
          }
        `}
      >
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      
      <span className="text-lg font-bold">{likeCount} Likes</span>
    </div>
  );
};

export default LikeButton;