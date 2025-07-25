import DeletePostAPI from "../api/DeletePostAPI";

function DeletePost({post}) {
    
    const findPostToDel = (postId) => {
        let postID;
        
        for (let i=0; i<post._id.length; i++) {
            if (postId === post._id) {
                postID = post._id;
                return DeletePostAPI(postId);
            }
        }
    }

    return (
        <div className='flex flex-row place-content-between'>
            <div className='font-bold text-sm'>{post.formattedTimestamp}</div>
            {post.isOwner && <button onClick={() =>  findPostToDel(post._id)} className='font-bold text-lg px-2'>X</button>}
        </div>
    )
}

export default DeletePost;