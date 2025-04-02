import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();
  
  const isLoggedIn = !!localStorage.getItem('token');
  const currentUser = isLoggedIn ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/comments/post/${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment,
          postId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const addedComment = await response.json();
      
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
    }
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/comments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: editContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update comment');
      }

      const updatedComment = await response.json();
      
      
      setComments(comments.map(comment => 
        comment.id === editingId ? updatedComment : comment
      ));
      
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }
      
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err.message);
    }
  };

  const startEditComment = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Comment form */}
      {isLoggedIn && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Add a comment..."
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post Comment
          </button>
        </form>
      )}

      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <p>
            <a href="/login" className="text-blue-500 hover:underline">Log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments list */}
      {loading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white p-4 rounded shadow">
              {editingId === comment.id ? (
                <form onSubmit={handleEditComment}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    rows="3"
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white text-sm py-1 px-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                <div className="flex items-center mb-2">
                {/* Always use initial avatar */}
                 <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                    {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <span className="font-bold">{comment.author.name || comment.author.username}</span>
                    <span className="text-gray-500 text-sm ml-2">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'just now'}
                    </span>
                </div>
            </div>
                  <p className="mb-2">{comment.content}</p>
                  
                  {currentUser && currentUser.id === comment.author.id && (
                    <div className="flex space-x-2 text-sm">
                      <button
                        onClick={() => startEditComment(comment)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;