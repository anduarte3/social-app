function DeletePostModal({ onConfirm, onCancel }) {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md px-5 mx-4">
                <div className="relative bg-white p-8 shadow-2xl ring-1 ring-gray-900/5 rounded-xl border-2 border-gray-400">
                    <div className="font-extrabold text-2xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 mb-6">
                        <h2>Confirm Deletion</h2>
                    </div>
                    <p className="text-gray-700 mb-8">Are you sure you want to delete this post? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg border-2 border-gray-400 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            className=" bg-red-500 hover:bg-red-400 text-white font-medium border-b-2 border-red-700 hover:border-red-500 px-6 py-2 rounded-lg  hover:opacity-90 transition-opacity shadow-md"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePostModal;