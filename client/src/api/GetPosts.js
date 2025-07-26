import { useState, useEffect } from "react";
import RenderPosts from "../hooks/RenderPosts";
import socket from "../utils/socket";

function GetPosts() {
    const [postData, setPostData] = useState([]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/feedload`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const responseData = await response.json();                
                setPostData(responseData.posts);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        
        console.log(socket);
        
        socket.on('new_post', (newPost) => {
            setPostData(prevPosts => [newPost, ...prevPosts]);
        });

        socket.on('post_deleted', (postId) => {
            console.log('Post deleted:', postId);
            setPostData(prevPosts => prevPosts.filter(post => post._id !== postId));
        });

        socket.on('post_updated', (updatedPost) => {
            console.log('Post updated:', updatedPost);
            setPostData(prevPosts => 
            prevPosts.map(post => 
                post._id === updatedPost._id ? updatedPost : post
            )
            );
        });

        return () => {
            if (socket) {
                socket.off('new_post');
                socket.off('post_deleted');
                socket.off('post_updated');
            }
        };

    }, []);
    
    return (
        <div>
            <RenderPosts postData={postData}/>
        </div>
    )
}

export default GetPosts;