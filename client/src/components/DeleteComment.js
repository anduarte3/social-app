import DeleteCommentAPI from '../api/DeleteCommentAPI';
import cross from '../assets/cross.png';

function DeleteComment({ postId, commentId, isOwner, onCommentDeleted }) {
    
    const handleDelete = async () => {
        try {
            await DeleteCommentAPI(postId, commentId);
            if (onCommentDeleted) {
                onCommentDeleted(commentId);
            }
        } catch (err) {
            console.error('Failed to delete comment:', err.message);
        }
    };

    if (!isOwner) return null;

    return (
        <button onClick={handleDelete} className="text-red-500">
            <img src={cross} className="w-2 h-2" alt="cross" />
        </button>
    );
}

<<<<<<< HEAD
export default DeleteComment;
=======
export default DeleteComment;
>>>>>>> dev
