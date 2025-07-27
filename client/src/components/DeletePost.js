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
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <div>
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