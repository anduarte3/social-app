import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function CreatePost() {
    const [postText, setPostText] = useState({ post: '' });
    const location = useLocation();
    const username = location.state && location.state.username;
    
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
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postText, username }),
            });

            if (response.ok) {
                const responseData = await response.json();
                //await fetchPosts();
                setPostText({ post: '' });
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };

    return (
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
                        required
                    />
                    <button type="submit"
                        className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-5 px-10 mt-10 mr-10 border-b-2 border-blue-700 hover:border-blue-500 rounded'>
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost;