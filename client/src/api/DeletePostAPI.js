
async function DeletePostAPI(postId) {
    
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

        }
    } catch (error) {
        console.error('Error deleting post:', error.message);
    }
}

export default DeletePostAPI;