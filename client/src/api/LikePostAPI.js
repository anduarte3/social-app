
async function LikePostAPI(postId) {
    try {
        const token = localStorage.getItem('token');
        // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/like`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        return await response.json();
        
    } catch (error) {
        console.error('Error updating likes:', error.message);
    }
};

export default LikePostAPI;