
async function CreatePostAPI(e, postId) {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const formData = new FormData(e.target);
        const commentText = formData.get('comment');

        // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post/${postId}/comment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ commentText })
        });

        if (response.ok) {
            //await fetchPosts();
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    setIsClicked(false);

}

export default CreatePostAPI;