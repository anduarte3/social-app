import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import profile from '../assets/profile.png'
import padlock from '../assets/padlock.png'

const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loginData, setLoginData] = useState({ username: '', password: '',})

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send formData to the server via API
        try {
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loginData }),
            });
            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message);
                navigate('/feed', {state: {username: loginData.username}});
                setLoginData({
                    username: '',
                    password: '',
                })
                
                // Store the token in localStorage or cookies
                localStorage.setItem('token', responseData.token);
            } else {
                const errorData = await response.json();
                setErrorMsg(errorData.message)
            }
        } catch (error) {
            setErrorMsg('There maybe be issues connecting to server. Please try again later.');
        }
    }

    return (
        <div className='absolute h-full w-full px-5 py-24 bg-white'>
            <div className='relative flex flex-col justify-center overflow-hidden py-6 sm:py-12'>
                <div className='relative w-full px-20 pt-10 pb-8 shadow-2xl ring-1 ring-gray-900/5 
                xs:mx-auto xs:max-w-2xl xs:rounded-xl xs:px-10 xs:pt-10 xs:pb-10 text-black'>
                    <div className='font-extrabold ext-4xl leading-tight text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 
                    transform scale-100'>Be Social, Be You.</div>
                    <div className='login-container'>
                        <form onSubmit={handleSubmit}>
                            <div className="flex px-4 pb-2 pt-14">
                                {/* Username Input */}
                                <img src={profile} className='w-8 h-8'></img>
                                <div className='flex hover-pb-8 ml-2'>
                                    <label></label>
                                    <input 
                                        type='text' 
                                        name='username' 
                                        placeholder='Username'
                                        value={loginData.username}
                                        onChange={handleChange}
                                        className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex px-4 pb-14">
                                {/* Password Input */}
                                <img src={padlock} className='w-8 h-8'></img>
                                <div className='flex hover-pb-8 ml-2'>
                                    <label></label>
                                    <input 
                                        type="password" 
                                        name='password' 
                                        placeholder='Password'
                                        value={loginData.password}
                                        onChange={handleChange}
                                        className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 border-b-2 border-blue-700 hover:border-blue-500 rounded">Login</button>
                        </form>
                        {message && <div>{message}</div>}
                        <p className='pt-5'>Don't have an account? <Link to='/register' className='font-bold text-blue-500'> Sign Up</Link></p>
                        {errorMsg && <p className="text-red-500 py-5">{errorMsg}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login