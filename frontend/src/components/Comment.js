import React, { useState, useEffect } from 'react';

function Comment({ comment }) {
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Fetch the user data for the comment author
    fetchAuthorData(comment.postedBy);
  }, [comment.postedBy]);

  const fetchAuthorData = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}`);
      const data = await res.json();
      setAuthorName(data.username);
    } catch (error) {
      console.error('Error fetching author data:', error);
    }
  };





  return (
    <div className="comment">
      <p className="comment-author">User {authorName} asked:</p>
      <p className="comment-content">{comment.content}</p>
      {/* Add any additional comment information you want to display */}
    </div>
  );
}

export default Comment;
