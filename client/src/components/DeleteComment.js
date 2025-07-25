
// Not added yet!

function DeleteComment() {

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/post/${postId}/comment/${commentId}/delete`, {
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

    return (
        <div></div>
    )
}

export default DeleteComment