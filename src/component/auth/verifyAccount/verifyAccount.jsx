
import React, { useState, useRef } from 'react';
import styles from './verifyAccount.module.css';
import {useNavigate,Link} from 'react-router-dom';
import { authService } from '../AuthService';


const Verify = () => {
  const navigate=useNavigate();
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const[otpGenerated,setOtpGenerated]=useState(false);
  // Ripple state
  const [ripples, setRipples] = useState([]);
  const messageTimeoutRef = useRef(null);

  // Show message helper
  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle input focus (hide error messages)
  const handleInputFocus = () => {
    if (message.type === 'error') {
      setMessage({ text: '', type: '' });
    }
  };

  // Form validation and submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Add loading state
    setLoading(true);

    // Simulate API call
    try{
      const credentials={
      'email':email,
      'otp': password
       };

      await authService.verifyAccount(credentials);

      showMessage('veification successful! Redirecting...', 'success');

      setTimeout(() => {
        navigate('/login');
      }, 50);
    }
    catch(error){
      showMessage(error.response.data || 'Verification failed','error');
    }
    finally{
      setLoading(false);
    }
    
  };

  //generate otp
   const generateOtp = async () =>{
    
    
    // Basic validation
    if (!email) {
      showMessage('Please fill in email', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    // Add loading state
    setLoading(true);

    // Simulate API call
    try{
      await authService.generateOtpVo(email);
      setOtpGenerated(true);

      showMessage('Otp sent successful! Redirecting...', 'success');

    }
    catch(error){
      showMessage(error.response.data || 'otp generation failed','error');
    }
    finally{
      setLoading(false);
    }
   }

  // Ripple effect handler
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Math.random().toString(36).slice(2);

    const ripple = { id, size, x, y };
    setRipples((prev) => [...prev, ripple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <div className={styles['login-header']}>
          <div className={styles['logo-container']}>ECI</div>
          <h1>Welcome</h1>
          <p>Verify to access your voting portal</p>
        </div>

        {/* Message container */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]} ${styles.show}`}>
            {message.text}
          </div>
        )}

        <form className={styles['login-form']} onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className={styles['input-group']}>
            <div className={styles['input-wrapper']}>
              <span className={styles['input-icon']}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus}
              />
              <label htmlFor="email">Email Address</label>
            </div>
          </div>
            <button
              type="button"
              className={`${styles.btn} ${styles['btn-primary']} ${loading ? styles.loading : ''}`}
              onClick={(e)=>{
                handleRipple(e);
                generateOtp();
              }}
            >
              <span>Get otp</span>
              {ripples.map((r) => (
                <span
                  key={r.id}
                  style={{
                    position: 'absolute',
                    width: r.size,
                    height: r.size,
                    top: r.y,
                    left: r.x,
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    transform: 'scale(0)',
                    animation: 'ripple 0.6s ease-out',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </button>
          {/* Password Input */}
          {otpGenerated&&
          <div className={styles['input-group']}>
            <div className={styles['input-wrapper']}>
              <span className={styles['input-icon']}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder=""
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
              />
              <label htmlFor="password">OTP</label>
              <button
                type="button"
                className={styles['password-toggle']}
                onClick={togglePassword}
              >
                <span>{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>}

          {/* Role Selector
          <div className={styles['input-group']}>
            <div className={styles['input-wrapper']}>
              <span className={styles['input-icon']}>👤</span>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={handleInputFocus}
              >
                <option value="">Select your role</option>
                <option value="VOTER">Voter</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div> */}

          {/* Buttons */}
          <div className={styles['btn-group']}>
            <button
              type="submit"
              className={`${styles.btn} ${styles['btn-primary']} ${loading ? styles.loading : ''}`}
              onClick={(e)=>handleRipple(e)}
            >
              <span>✓ Verify Account</span>
              {ripples.map((r) => (
                <span
                  key={r.id}
                  style={{
                    position: 'absolute',
                    width: r.size,
                    height: r.size,
                    top: r.y,
                    left: r.x,
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    transform: 'scale(0)',
                    animation: 'ripple 0.6s ease-out',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </button>

            <Link to="/signup" className={`${styles.btn} ${styles['btn-secondary']}`}>
              <span>Log In</span>
            </Link>

            <button
              type="button"
              className={`${styles.btn} ${styles['btn-secondary']}`}
              onClick={() => navigate('/auth/verify')}
            >
              <span>Sign Up</span>
            </button>
          </div>

          {/* Links */}
          <div className={styles['form-links']}>
            <Link to="/auth/forgot-password" className={styles['form-link']}>
              Forgot Password?
            </Link>
            <Link to="/" className={styles['form-link']}>
              Back to Home
            </Link>
          </div>
        </form>

        <div className={styles.divider}>
          <span>Secure Login</span>
        </div>

        <div className={styles['login-footer']}>
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <Link to="/help">Need Help?</Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
