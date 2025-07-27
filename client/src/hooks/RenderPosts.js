import DeletePost from '../components/DeletePost';
import LikePost from '../components/LikePost';
import Comment from '../components/Comment';
import DeleteComment from '../components/DeleteComment';

function RenderPosts({postData}) {
    
    return (
        <div>
            {postData.map((post) => (
                <div className='border-2 border-gray-400 rounded-2xl mt-10 p-5 flex flex-col text-black' key={post._id}>
                <div className='flex flex-row place-content-between'>
                <div className='flex'>
                    <div className='flex font-bold text-sm'>{post.formattedTimestamp}
                        <div className='font-light px-1'>by</div>
                        <div className=''>{post.username}</div>
                    </div>
                </div>
                    <DeletePost post={post} postTime={post.formattedTimestamp} postOwner={post.isOwner} postId={post._id}/>
                </div>
                    <div className='text-4xl py-2 px-5 mr-10 mt-5 mb-5'>{post.content}</div>
                    <div className='flex'>
                        <div className='flex flex-row ml-5 items-center'><LikePost post={post} liked={post.liked}/></div>
                        <div className='items-center'><Comment post={post}/></div>
                    </div>
                    <div>
                        {post.comments.map((comment) => (
                            <div key={comment._id}>
                            <div className='m-1 p-1'></div>
                            <DeleteComment 
                                postId={post._id} 
                                commentId={comment._id} 
                            />
                            <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RenderPosts;