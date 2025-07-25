import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className='absolute top-0 right-0 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 mt-10 mr-10 border-b-2 border-blue-700 hover:border-blue-500 rounded'>Logout
        </button>
    )
}

export default LogoutBtn;