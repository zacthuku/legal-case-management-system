
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CaseComments = () => {
  const { id } = useParams(); 
  const { auth_token, currentUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/cases/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      else setComments(data);
    } catch (err) {
      toast.error('Failed to load comments.');
    }
  };

  const postComment = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/cases/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({
          case_id: id,
          user_id: currentUser?.id,
          content: newComment,
        }),
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      else {
        toast.success('Comment added');
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      toast.error('Failed to post comment.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-3 rounded shadow-sm">
            <p className="text-sm text-gray-700">{comment.content}</p>
            <p className="text-xs text-gray-500">By: {comment.username}</p>
          </div>
        ))}
      </div>

      {(currentUser?.role === 'client' || currentUser?.role === 'lawyer') && (
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={postComment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseComments;
