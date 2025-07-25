import { useLocation } from 'react-router-dom';

function DeletePost(post) {
    const location = useLocation();
    const username = location.state && location.state.username;

    const handleDelete = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post/${postId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                //await fetchPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    return (
        <div className='flex flex-row place-content-between'>
            <div className='font-bold text-sm'>{post.formattedTimestamp}</div>
            <div className='font-bold text-sm mx-5'>{username}</div>
            {post.isOwner && <button onClick={() => handleDelete(post._id)}
                className='font-bold text-lg px-2'>X</button>}
        </div>
    )
}

export default DeletePost