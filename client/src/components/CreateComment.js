import { useState } from "react";
import CreatePostAPI from "../api/CreatePostAPI";

function CreateComment(post) {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <div>
            {isClicked && (
                <div className="comment-section">
                    <form onSubmit={(e) => CreatePostAPI(e, post._id)}>
                        <input
                            type="text"
                            name='comment'
                            placeholder='Reply to post'
                            onChange={<useComment/>}
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg p-2 mt-2 w-full'
                        />
                        <div className="option flex justify-between mt-2">
                            <button type="submit" className="reply-button bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Post</button>
                            <button type="button" className="cancel-button bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded" onClick={<useComment/>}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CreateComment