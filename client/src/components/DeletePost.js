import { useState } from 'react';
import DeletePostAPI from '../api/DeletePostAPI';
import DeletePostModal from './DeletePostModal';
import cross from '../assets/cross.png';

function DeletePost({ post }) {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            await DeletePostAPI(post._id);
            setShowModal(false);
            // You might want to add state update here to reflect the deletion in UI
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <div className='flex flex-row place-content-between'>
            <div className='font-bold text-sm'>{post.formattedTimestamp}</div>
            {post.isOwner && (
                <div>
                    <button 
                        onClick={() => setShowModal(true)} 
                        className='font-bold text-lg px-2'
                    >
                        <img src={cross} className='w-4 h-4' alt="cross" />
                    </button>
                    
                    {showModal && (
                        <DeletePostModal
                            onConfirm={handleDelete}
                            onCancel={() => setShowModal(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default DeletePost;