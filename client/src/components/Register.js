import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import user from '../img/user-icon.png'
import password from '../img/password-icon.png'
import mail from '../img/mail.png'

const Register = () => {
    const navigate = useNavigate();
    //Define the default useState values
    const [message, setMessage] = useState('')
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
        //Send formData to the server via API
        try {
            const response = await fetch('http://localhost:3001/api/register', {
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
                if (errorData.errorValidation) {
                    setMessage(`${errorData.errorValidation[0].msg}`)
                } else {
                    setMessage(`${errorData.errorMessages[0].msg}`)
                }
            }
        } catch (error) {
            console.error('Error sending data:', error.message);
            setMessage('An error occurred. Please try again.');
        }
    }

    return (
        <div className='mainpage-section'>
            <div className='register-title'>Sign Up</div>
            <div className='register-container'>
                <form onSubmit={handleSubmit}>
                    <div className="register-fields">
                        {/* Username Input */}
                        <img src={user} className='register-icons'></img>
                        <div className='input-label'>
                            <label>Username</label>
                                <input 
                                    type='text' 
                                    name='username' 
                                    placeholder='Username'
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                        </div>
                    </div>
                    <div className="register-fields">
                        {/* Email Input */}
                        <img src={mail} className='register-icons'></img>
                        <div className='input-label'>
                            <label>Email</label>
                            <input 
                                type='email' 
                                name='email' 
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="register-fields">
                        {/* Password Input */}
                        <img src={password} className='register-icons'></img>
                        <div className='input-label'>
                            <label>Password</label>
                            <input 
                                type="password" 
                                name='password' 
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="register-fields">
                        {/* Confirm Password Input */}
                        <img src={password} className='register-icons'></img>
                        <div className='input-label'>
                            <label>Password</label>
                            <input 
                                type="password" 
                                name='confirmPassword' 
                                placeholder='Confirm Password'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="register-button">Sign Up</button>
                </form>
                {message && <div>{message}</div>}
                <p className='para'>Already have an account? <Link to='/' className='login-link'> Sign In</Link></p>
            </div>
        </div>
    )
}

export default Register