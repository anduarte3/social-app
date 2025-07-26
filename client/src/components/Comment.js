import { useContext, useState } from 'react';
import comment from '../assets/comment.png';
import AddCommentAPI from "../api/AddCommentAPI";

function Comment({ post }) {
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AddCommentAPI(post._id, commentText);
    setShowModal(false);
    setCommentText('');
  };

  return (
    <div>
      {/* Comment Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="ml-4 flex items-center hover:scale-110 transition-transform"
      >
        <img src={comment} className="w-6 h-6" alt="comment" />
      </button>

      {/* Comment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Add a comment</h3>
            
            <form onSubmit={handleSubmit}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                rows="4"
                autoFocus
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white hover:bg-sky-600 rounded-lg"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comment;