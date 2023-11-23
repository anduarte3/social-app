import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Feed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state && location.state.username;
    const [message, setMessage] = useState('');
    const [postText, setPostText] = useState({ post: '' });

    // ------------------------------ TOKEN/LOGIN & LOGOUT ------------------------------ //

    useEffect(() => {
        // Check token status initially
        checkTokenStatus();

        // Set up interval to check token status every minute
        const intervalId = setInterval(checkTokenStatus, 60000); // 60000 milliseconds = 1 minute

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate]);

    const checkTokenStatus = () => {
        // Check if there is a token in localStorage
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
            // Handle invalid or malformed tokens
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Redirect to the login page after logout
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
        // Send message to the server via API
        try {
            const response = await fetch('http://localhost:3001/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postText, username }),
            });
            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message)
                console.log(responseData);

                // setPostText({ postText: '' })
            } else {
                const errorData = await response.json();
                console.log('error api response', errorData);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            <h1>Welcome to Social App, {username}</h1>
            {/* Feed content goes here */}
            <form onSubmit={handleSubmit}>
                <input 
                    type='text' 
                    name='post' 
                    placeholder='What are you thinking?'
                    value={postText.post}
                    onChange={handleChange}
                />
                <button type="submit" className="post-button">Create Post</button>
            </form>
        </div>
    );
};

export default Feed;
