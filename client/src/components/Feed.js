import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Feed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState(null); // State to store the user ID
    const username = location.state && location.state.username;
    const [postText, setPostText] = useState({ post: '' });
    const [postDataArray, setPostDataArray] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [commentText, setCommentText] = useState('');

    // ------------------------------ TOKEN/LOGIN & LOGOUT ------------------------------ //

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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postText, username }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                await fetchPosts();
                setPostText({ post: '' })
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
            const response = await fetch(`http://localhost:3001/api/post/${postId}/delete`, {
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
    // ------------------------------ LIKES ------------------------------ //
    const handleLikeButton = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/post/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                //console.log(responseData);
                if (responseData.liked) {              
                    await fetchPosts();
                } else {              
                    await fetchPosts();
                }
                console.log('Like updated successfully');
            }
        } catch (error) {
            console.error('Error updating likes:', error.message);
        }
    };

    // ------------------------------ COMMENTS ------------------------------ //
    const handleAddComment = (e) => {
        setIsClicked(true);
    }

    const handleCommentChange = (e) => {
        setCommentText({
            ...commentText,
            [e.target.name]: e.target.value,
        })
    }

    const handleInput = async (e, postId) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(e.target); // Get the form data
            const commentText = formData.get('comment'); // Extract the comment text from the form data
    
            const response = await fetch(`http://localhost:3001/api/post/${postId}/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ commentText })
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.commentPost) {
                    console.log(responseData.userId);
                    await fetchPosts();
                } else {
                    await fetchPosts();
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setIsClicked(false);
    }

    const handleCancel = (e) => {
        setIsClicked(false);
    }

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await fetch(`http://localhost:3001/api/post/${postId}/comment/${commentId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData) {
                    await fetchPosts();
                } else {
                    await fetchPosts();
                }
            } 
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    const handleEditComment = (e) => {
        
    }

    // ------------------------------ GET POSTS ------------------------------ //
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
                console.log(responseData.posts);
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
                <button type="submit" className="post-button">Post</button>
            </form>

            {/* Render new post here */}
            <div>
                <h1>Posts:</h1>
                <div>
                    {postDataArray.map((post) => (
                        <div key={post._id}>
                            {post.isOwner && <button onClick={() => handleDelete(post._id)}>delete</button>}
                            <p>
                                <strong>Time:</strong> {post.timestamp}
                            </p>
                            <p>
                                <strong>Content:</strong> {post.content}
                            </p>
                            <p>
                                <strong>Like Count</strong> {post.likesCount}
                            </p>
                            <div>
                            {post.comments.map((comment) => (
                                <div key={comment._id}>
                                    {/* Display comment content */}
                                    <p>{comment.content}
                                    {/* {comment.user_id === currentUser.id && (  */}
                                        <span>
                                            <button onClick={() => handleEditComment(post._id, comment._id)}>Edit</button>
                                            <button onClick={() => handleDeleteComment(post._id, comment._id)}>Delete</button>
                                        </span>
                                    {/* )} */}
                                    </p>
                                </div>
                            ))}
                            </div>
                        <button onClick={() => handleLikeButton(post._id)}>like me</button>
                        
                        {isClicked && (
                            <div className="comment-section">
                                <form onSubmit={(e) => handleInput(e, post._id)}>                                
                                    <input
                                        type="text" 
                                        name='comment' 
                                        placeholder='Reply to post'
                                        onChange={handleCommentChange}
                                    />
                                    <div className="option">
                                        <button type="submit" className="reply-button">Post</button>
                                        <button type="button" className="cancel-button" onClick={handleCancel}>X</button>
                                    </div>
                                </form>
                            </div> 
                        )}
                        {!isClicked && (
                            <div className="comment-section">
                                <button onClick={() => handleAddComment(post._id)}>Add comment</button>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;