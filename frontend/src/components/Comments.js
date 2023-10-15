import { useState, useEffect } from 'react';
import Comment from './Comment';

function Comments({ photoId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("paling");
        const res = await fetch(`http://localhost:3001/photos/${photoId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [photoId]);
  return (
    <div className="comments">
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}

export default Comments;