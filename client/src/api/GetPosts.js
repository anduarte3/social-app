import { useState, useEffect } from "react";
import RenderPosts from "../hooks/RenderPosts";

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
    }, []);
    
    return (
        <div>
            <RenderPosts postData={postData}/>
        </div>
    )
}

export default GetPosts;