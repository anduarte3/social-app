
function CreateComment() {
    const [isClicked, setIsClicked] = useState(false);

    const handleInput = async (e, postId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(e.target);
            const commentText = formData.get('comment');

            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post/${postId}/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ commentText })
            });

            if (response.ok) {
                //await fetchPosts();
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setIsClicked(false);
    };

    return (
        <div>
            {isClicked && (
                <div className="comment-section">
                    <form onSubmit={(e) => handleInput(e, post._id)}>
                        <input
                            type="text"
                            name='comment'
                            placeholder='Reply to post'
                            onChange={handleCommentChange}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg p-2 mt-2 w-full'
                        />
                        <div className="option flex justify-between mt-2">
                            <button type="submit" className="reply-button bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Post</button>
                            <button type="button" className="cancel-button bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CreateComment