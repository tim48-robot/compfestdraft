import React, { useState } from 'react';

const LikeButton = () => {
  // 1. Create two state variables
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 2. Function to handle like/unlike
  const handleLikeToggle = () => {
    // This line FLIPS the current value of isLiked
    // If isLiked was false, it becomes true
    // If isLiked was true, it becomes false
    setIsLiked(!isLiked);
    
    // Conditional logic based on the NEW value of isLiked
    if (!isLiked) {
      // If it was NOT liked before (now becoming liked)
      // Increment the like count
      setLikeCount(prevCount => prevCount + 1);
    } else {
      // If it was liked before (now becoming unliked)
      // Decrement the like count
      setLikeCount(prevCount => prevCount - 1);
    }
  };

  return (
    // 3. Rendering the button with dynamic classes and content
    <div className="flex items-center space-x-4">
      <button 
        // 4. onClick triggers handleLikeToggle function
        onClick={handleLikeToggle}
        // 5. Dynamic classes based on isLiked state
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