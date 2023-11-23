import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import user from '../img/user-icon.png'
import password from '../img/password-icon.png'

const Login = () => {
    const navigate = useNavigate();
    //Define the default useState values
    const [message, setMessage] = useState('');
    const [loginData, setLoginData] = useState({ username: '', password: '',})

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Send formData to the server via API
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loginData }),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                setMessage(responseData.message);
                navigate('/feed', { state: {username: loginData.username}});
                setLoginData({
                    username: '',
                    password: '',
                })

                //Store the token in localStorage or cookies
                localStorage.setItem('token', responseData.token);
            } else {
                const errorData = await response.json();
                console.log('error api response', errorData);
                navigate('/login');
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
            setMessage('An error occurred. Please try again.');
        }
    }

    return (
        <div className='mainpage-section'>
            <div className='login-title'>Login</div>
            <div className='login-container'>
                <form onSubmit={handleSubmit}>
                    <div className="login-fields">
                        {/* Username Input */}
                        <img src={user} className='login-icons'></img>
                        <div className='input-label'>
                            <label>Username</label>
                            <input 
                                type='text' 
                                name='username' 
                                placeholder='Username'
                                value={loginData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="login-fields">
                        {/* Password Input */}
                        <img src={password} className='login-icons'></img>
                        <div className='input-label'>
                            <label>Password</label>
                            <input 
                                type="password" 
                                name='password' 
                                placeholder='Password'
                                value={loginData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                {message && <div>{message}</div>}
                <p className='para'>Don't have an account? <Link to='/register' className='signup-link'> Sign Up</Link></p>
            </div>
        </div>
    )
}

export default Login