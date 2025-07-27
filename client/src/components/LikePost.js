import { useEffect, useState } from 'react';
import blackheart from '../assets/heart.png';
import redheart from '../assets/heartred.png';
import LikePostAPI from '../api/LikePostAPI';

function LikePost({ post }) {
    const [isLiked, setIsLiked] = useState(post.liked);

    useEffect(() => {
        setIsLiked(post.liked);
    }, [post.liked]);

    const handleLikeClick = async () => {
        try {
            const result = await LikePostAPI(post._id);
            setIsLiked(result.liked);
        } catch (err) {
            console.error('Could not toggle like:', err);
        }
    };

    return (
        <div>
            <button onClick={handleLikeClick} className="flex items-center">
            <img
                src={isLiked ? redheart : blackheart}
                className="w-6 h-6"
                alt={isLiked ? 'Liked' : 'Not liked'}
            />
            </button>
        </div>
    );
}

export default LikePost;