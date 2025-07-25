import comment from '../assets/comment.png';

function Comment() {

    const handleAddComment = (e) => {
        setIsClicked(true);
    };

    const handleCommentChange = (e) => {
        setCommentText({
            ...commentText,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancel = (e) => {
        setIsClicked(false);
    };
    
    return (
        <button onClick={() => handleAddComment(post._id)} className='ml-4 flex items-center'>
            <img src={comment} className='w-7 h-7' alt="comment" />
            <span className='ml-2 text-lg'>Comment</span>
        </button>
    )
}

export default Comment;