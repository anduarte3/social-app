import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Feed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state && location.state.username;
    const [message, setMessage] = useState('');
    const [postText, setPostText] = useState({ post: '' });
    const [postDataArray, setPostDataArray] = useState([]);

    // ------------------------------ TOKEN/LOGIN & LOGOUT ------------------------------ //

    useEffect(() => {
        checkTokenStatus();
        const intervalId = setInterval(checkTokenStatus, 60000); // 60000 milliseconds = 1 minute
        return () => clearInterval(intervalId);
    }, [navigate]);

    const checkTokenStatus = () => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken || isTokenExpired(storedToken)) {
            // Redirect to the login page if there is no token or if it's expired
            console.log('Token not found or expired. Redirecting to /login');
            navigate('/login');
        }
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

    // ------------------------------ POSTS ------------------------------ //
    
    const handleChange = (e) => {
        setPostText({
            ...postText,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postText, username }),
            });

            if (response.ok) {
                const responseData = await response.json();
                await fetchPosts();
                setPostText({ post: '' })
            } else {
                const errorData = await response.json();
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    // To be added
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
    }

    const handleDelete = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/post/${postId}`, {
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
    }

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3001/api/feedload', {
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
        <div>
            <button onClick={handleLogout}>Logout</button>
            <h1>Welcome to Social App, {username}</h1>
            {/* Feed content goes here */}
            <form onSubmit={handleSubmit}>
                {/* TEXTAREA INSTEAD! */}
                <input 
                    type='text' 
                    name='post' 
                    placeholder='What are you thinking?'
                    value={postText.post}
                    onChange={handleChange}
                />
                <button type="submit" className="post-button">Create Post</button>
            </form>

            {/* Render new post here */}
            <div>
                <h1>Posts:</h1>
                <div>
                    {postDataArray.map((post) => (
                        <div key={post._id}>
                            {post.isOwner && <button onClick={() => handleDelete(post._id)}>delete</button>}
                            <strong>Time</strong> {post.timestamp}
                            <strong>Content:</strong> {post.content}
                            <form onSubmit={handleCommentSubmit}>
                            <input type='textarea' placeholder=''></input>
                            <button type='submit' className='comment-button'>Send comment</button>
                        </form>
                        <button>like</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;
