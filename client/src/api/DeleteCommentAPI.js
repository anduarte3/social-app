async function DeleteCommentAPI(postId, commentId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}/comment/${commentId}/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete comment');
    }
}

export default DeleteCommentAPI;