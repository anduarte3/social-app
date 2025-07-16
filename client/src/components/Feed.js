import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blackheart from '../img/heart.png';
import comment from '../img/comment.png';

const Feed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState(null); // State to store the user ID
    const username = location.state && location.state.username;
    const [postText, setPostText] = useState({ post: '' });
    const [postDataArray, setPostDataArray] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        checkTokenStatus();
        const intervalId = setInterval(checkTokenStatus, 60000); // 60000 milliseconds = 1 minute
        return () => clearInterval(intervalId);
    }, [navigate]);

    const checkTokenStatus = () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken || isTokenExpired(storedToken)) navigate('/login');
    };

    const isTokenExpired = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp < Date.now() / 1000;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChange = (e) => {
        setPostText({
            ...postText,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postText, username }),
            });

            if (response.ok) {
                const responseData = await response.json();
                await fetchPosts();
                setPostText({ post: '' });
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    const handleLikeButton = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    const handleAddComment = (e) => {
        setIsClicked(true);
    };

    const handleCommentChange = (e) => {
        setCommentText({
            ...commentText,
            [e.target.name]: e.target.value,
        });
    };

    const handleInput = async (e, postId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(e.target);
            const commentText = formData.get('comment');

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ commentText })
            });

            if (response.ok) {
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setIsClicked(false);
    };

    const handleCancel = (e) => {
        setIsClicked(false);
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/comment/${commentId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleEditComment = (e) => {
        // Implement edit comment functionality here
    };

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/feedload`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setPostDataArray(responseData.posts);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className='absolute min-h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>
            <button onClick={handleLogout} className='absolute top-0 right-0 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 mt-10 mr-10 border-b-2 border-blue-700 hover:border-blue-500 rounded'>
                Logout
            </button>
            <div className='relative flex flex-col justify-center overflow-hidden py-6 sm:py-12'>
                <div className='relative w-full px-20 pt-10 pb-8 shadow-2xl ring-1 ring-gray-900/5 xs:mx-auto xs:max-w-2xl xs:rounded-xl xs:px-10 xs:pt-10 xs:pb-10 text-white border-2 border-gray-400'>
                    <div className='font-extrabold text-4xl leading-tight text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 transform scale-100'>
                        <h1>Welcome {username}!</h1>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className='flex space-x-10'>
                                <input
                                    type='text'
                                    name='post'
                                    placeholder='What are you thinking?'
                                    value={postText.post}
                                    onChange={handleChange}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2'
                                />
                                <button type="submit"
                                    className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-5 px-10 mt-10 mr-10 border-b-2 border-blue-700 hover:border-blue-500 rounded'>
                                    Post
                                </button>
                            </div>
                        </form>

                        {/* Render new post here */}
                        <div>
                            <div>
                                {postDataArray.map((post) => (
                                    <div className='border-2 border-gray-400 rounded-2xl mt-10 p-5 flex flex-col text-white' key={post._id}>

                                        <p className='flex flex-row place-content-between'>
                                            <div className='font-bold text-sm'>{post.formattedTimestamp}</div>
                                            <div className='font-bold text-sm mx-5'>{username}</div>
                                            {post.isOwner && <button onClick={() => handleDelete(post._id)}
                                                className='font-bold text-lg px-2'>X</button>}
                                        </p>
                                        <p>
                                            <div className='text-4xl py-2 px-5 mr-10 mt-5 mb-5'>{post.content}</div>
                                        </p>
                                        <p className='flex flex-row ml-5 items-center'>
                                            <button onClick={() => handleLikeButton(post._id)} className='flex items-center'>
                                                <img src={blackheart} className='w-6 h-6' alt="like" />
                                                <span className='ml-2 text-lg'>{post.likesCount}</span>
                                            </button>

                                            <button onClick={() => handleAddComment(post._id)} className='ml-4 flex items-center'>
                                                <img src={comment} className='w-7 h-7' alt="comment" />
                                                <span className='ml-2 text-lg'>Comment</span>
                                            </button>
                                        </p>

                                        <div>
                                            {post.comments.map((comment) => (
                                                <div key={comment._id}>
                                                    <p>{comment.content}</p>
                                                </div>
                                            ))}
                                        </div>

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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
