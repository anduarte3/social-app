import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import profile from '../img/profile.png'
import padlock from '../img/padlock.png'
import mail from '../img/email.png'

const Register = () => {
    const navigate = useNavigate();
    //Define the default useState values
    const [message, setMessage] = useState('')
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleChange = (e) => {        
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ${process.env.REACT_APP_LOCAL_URL} or ${process.env.REACT_APP_BACKEND_URL}
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // like authentication token
                },
                body: JSON.stringify({ formData }),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                setMessage(responseData.message);
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                })
                navigate('/login')
            } else {
                const errorData = await response.json();
                console.log(errorData);
                if (errorData.errorInfo) {
                    setErrorMsg(`${errorData.errorInfo[0].msg}`)
                } else {
                    setErrorMsg(`${errorData.errorMessages[0].msg}`)
                }
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
            setErrorMsg('There maybe be issues connecting to server. Please try again later.');
        }
    }

    return (
        <div className='absolute h-full w-full px-5 py-24 bg-black'>
            <div className='relative flex flex-col justify-center overflow-hidden py-6 sm:py-12'>
                <div className='relative w-full px-20 pt-10 pb-8 shadow-2xl ring-1 ring-gray-900/5 
                xs:mx-auto xs:max-w-2xl xs:rounded-xl xs:px-10 xs:pt-10 xs:pb-10 text-white'>
                    <div className='font-extrabold ext-4xl leading-tight text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-400 to-cyan-500 
                    transform scale-100'>Create your account!</div>
                    <div className='register-container'>
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
                                            value={formData.username}
                                            onChange={handleChange}
                                            className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                            required
                                        />
                                </div>
                            </div>
                            <div className="flex px-4 pb-2 pt-14">
                                {/* Email Input */}
                                <img src={mail} className='w-8 h-8'></img>
                                <div className='flex hover-pb-8 ml-2'>
                                    <label></label>
                                    <input 
                                        type='email' 
                                        name='email' 
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex px-4 pb-2 pt-14">
                                {/* Password Input */}
                                <img src={padlock} className='w-8 h-8'></img>
                                <div className='flex hover-pb-8 ml-2'>
                                    <label></label>
                                    <input 
                                        type="password" 
                                        name='password' 
                                        placeholder='Password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex px-4 pb-2 pt-14">
                                {/* Confirm Password Input */}
                                <img src={padlock} className='w-8 h-8'></img>
                                <div className='flex hover-pb-8 ml-2'>
                                    <label></label>
                                    <input 
                                        type="password" 
                                        name='confirmPassword' 
                                        placeholder='Confirm Password'
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className='placeholder-white bg-black border-transparent transition focus:outline-none hover:translate-x-3 delay-150 focus:border-b-2'
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-5 mt-10 border-b-2 border-blue-700 hover:border-blue-500 rounded">Sign Up</button>
                        </form>
                        {message && <div>{message}</div>}
                        {errorMsg && <p className="text-red-500 py-5">{errorMsg}</p>}
                        <p className='mt-3'>Already have an account? <Link to='/' className='font-bold text-blue-500'> Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register