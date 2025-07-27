
async function AddCommentAPI(postId, commentText) {    
    try {
        const token = localStorage.getItem('token');
        // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/comment/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ commentText })
        });
        
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export default AddCommentAPI;