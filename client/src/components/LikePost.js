import blackheart from '../assets/heart.png';
import LikePostAPI from '../api/LikePostAPI';

function LikePost({post}) {

    const findPostToLike = (postId) => {
        let postID;

        for (let i=0; i<post._id.length; i++) {
            if (postId === post._id) {
                postID = post._id;
                return LikePostAPI(postId);
            }
        }
    }
    
    return (
        <div>
            <button onClick={() => findPostToLike(post._id)} className='flex items-center'>
                <img src={blackheart} className='w-6 h-6' alt="like" />
            </button>
        </div>
    )
}

export default LikePost;