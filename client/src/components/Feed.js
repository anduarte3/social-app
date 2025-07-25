import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TokenCheck from '../hooks/TokenCheck';
import LogoutBtn from './LogoutBtn';
import CreatePost from './CreatePost';
import GetPosts from '../api/GetPosts'

const Feed = () => {
    const location = useLocation();
    const [userId, setUserId] = useState(null); // State to store the user ID
    const username = location.state && location.state.username;

    TokenCheck();

    return (
        <div className='absolute min-h-full w-full px-5 py-24 bg-white'>
            <LogoutBtn/>
            <div className='relative flex flex-col justify-center overflow-hidden py-6 sm:py-12'>
                <div className='relative w-full px-20 pt-10 pb-8 shadow-2xl ring-1 ring-gray-900/5 xs:mx-auto xs:max-w-2xl xs:rounded-xl xs:px-10 xs:pt-10 xs:pb-10 text-white border-2 border-gray-400'>
                    <div className='font-extrabold text-4xl leading-tight text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 transform scale-100'>
                        <h1>Welcome {username}!</h1>
                    </div>
                    <div>
                        <CreatePost/>
                        <GetPosts/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
