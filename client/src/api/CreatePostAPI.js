
async function CreatePostAPI(postText) {

    try {
        const token = localStorage.getItem('token');
        // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postText }),
        });

        if (response.ok) {
            const responseData = await response.json();
            //await fetchPosts();
        } else {
            const errorData = await response.json();
        }
    } catch (error) {
        console.error('Error sending data:', error.message);
    }

}

export default CreatePostAPI;