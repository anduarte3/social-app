import blackheart from '../assets/heart.png';

function LikePost(post) {

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                //await fetchPosts();
            }
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    return (
        <div>
            <button onClick={() => handleLike(post._id)} className='flex items-center'>
                <img src={blackheart} className='w-6 h-6' alt="like" />
                <span className='ml-2 text-lg'>{post.likesCount}</span>
            </button>
        </div>
    )
}

export default LikePost