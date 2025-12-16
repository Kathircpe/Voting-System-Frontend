import React, { useState } from 'react';
import { authService } from '../AuthService';
import styles from './Signup.module.css';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [validation, setValidation] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== 'voter') {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength === 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const validateField = (fieldName, value) => {
    const validationRules = {
      name: {
        test: (val) => val.length >= 3,
        error: 'Name must be at least 3 characters',
        success: 'Valid name'
      },
      age: {
        test: (val) => val >= 18 && val <= 120,
        error: 'You must be 18 or older to vote',
        success: 'Valid age'
      },
      email: {
        test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        error: 'Please enter a valid email address',
        success: 'Valid email'
      },
      phone: {
        test: (val) => /^[0-9]{10}$/.test(val),
        error: 'Phone number must be exactly 10 digits',
        success: 'Valid phone number'
      },
      address: {
        test: (val) => val.length >= 10,
        error: 'Address must be at least 10 characters',
        success: 'Valid address'
      },
      password: {
        test: (val) => val.length >= 8,
        error: 'Password must be at least 8 characters',
        success: 'Strong password'
      },
      confirmPassword: {
        test: (val) => val === formData.password,
        error: 'Passwords do not match',
        success: 'Passwords match'
      }
    };

    const rule = validationRules[fieldName];
    if (!rule) return;

    if (value && rule.test(value)) {
      setValidation({
        ...validation,
        [fieldName]: { valid: true, message: rule.success }
      });
    } else if (value) {
      setValidation({
        ...validation,
        [fieldName]: { valid: false, message: rule.error }
      });
    }
  };

  const validateAllFields = () => {
    const fields = ['name', 'age', 'email', 'phone', 'address', 'password'];
    let isValid = true;

    fields.forEach(field => {
      if (!formData[field] || validation[field]?.valid === false) {
        isValid = false;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      isValid = false;
    }

    return isValid;
  };

  const handleGenerateOtp = async () => {
    if (!validateAllFields()) {
      setMessage({ text: 'Please fill all fields correctly before generating OTP', type: 'error' });
      return;
    }
    setIsLoading(true);

    try {
      const credentials = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        phoneNumber: formData.phone,
        voterAddress: formData.address,
        password: formData.password
      };

      await authService.signUp(credentials);

      setShowOtp(true);
      setOtpGenerated(true);
      setMessage({ text: 'successfully otp generated', type: 'success' });

    } catch (error) {
      console.log('Full error:', error.response);
      setMessage({
        text: error.response.data || error.message || 'Signup failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp${index + 2}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp${index}`)?.focus();
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setMessage({ text: 'Please enter the complete 6-digit OTP', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        email: formData.email,
        otp: otpValue
      };

      await authService.verifyAccount(credentials);

      setMessage({ text: 'Account verified successfully! Redirecting...', type: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 10);
    } catch (error) {
      setMessage({
        text: error.response.data || 'Verification failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }

  };

  const hideMessage = () => {
    if (message.type === 'error') {
      setMessage({ text: '', type: '' });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>ECI</div>
          <h1>Create Account</h1>
          <p>Sign up to access your voting portal.</p>
          <p>Your data is securely stored and it</p>
          <p>won't be compromised at any time.</p>

        </div>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]} ${styles.show}`}>
            {message.text}
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>

          {/* Name Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.name ? (validation.name.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>👤</span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleInputChange}
                onBlur={(e) => validateField('name', e.target.value)}
                onFocus={hideMessage}
                required
                autoComplete="name"
                minLength="3"
              />
              <label htmlFor="name">Full Name</label>
            </div>
            {validation.name && (
              <div className={`${styles.validationMsg} ${validation.name.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.name.message}
              </div>
            )}
          </div>

          {/* Age Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.age ? (validation.age.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>🎂</span>
              <input
                type="number"
                id="age"
                name="age"
                placeholder=" "
                value={formData.age}
                onChange={handleInputChange}
                onBlur={(e) => validateField('age', e.target.value)}
                onFocus={hideMessage}
                required
                min="18"
                max="120"
              />
              <label htmlFor="age">Age (18+)</label>
            </div>
            {validation.age && (
              <div className={`${styles.validationMsg} ${validation.age.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.age.message}
              </div>
            )}
          </div>

          {/* Email Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.email ? (validation.email.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => validateField('email', e.target.value)}
                onFocus={hideMessage}
                required
                autoComplete="email"
              />
              <label htmlFor="email">Email Address</label>
            </div>
            {validation.email && (
              <div className={`${styles.validationMsg} ${validation.email.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.email.message}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.phone ? (validation.phone.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>📱</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder=" "
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={(e) => validateField('phone', e.target.value)}
                onFocus={hideMessage}
                required
                pattern="[0-9]{10}"
                maxLength="10"
              />
              <label htmlFor="phone">Phone Number (10 digits)</label>
            </div>
            {validation.phone && (
              <div className={`${styles.validationMsg} ${validation.phone.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.phone.message}
              </div>
            )}
          </div>

          {/* Address Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.address ? (validation.address.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>📍</span>
              <textarea
                id="address"
                name="address"
                placeholder=" "
                value={formData.address}
                onChange={handleInputChange}
                onBlur={(e) => validateField('address', e.target.value)}
                onFocus={hideMessage}
                required
                minLength="10"
              />
              <label htmlFor="address">Etheruem Wallet Address</label>
            </div>
            {validation.address && (
              <div className={`${styles.validationMsg} ${validation.address.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.address.message}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.password ? (validation.password.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type={showPassword.password ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder=" "
                value={formData.password}
                onChange={handleInputChange}
                onBlur={(e) => validateField('password', e.target.value)}
                onFocus={hideMessage}
                required
                minLength="8"
              />
              <label htmlFor="password">Password (min 8 characters)</label>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePassword('password')}
              >
                <span>{showPassword.password ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {passwordStrength && (
              <div className={`${styles.passwordStrength} ${styles.show}`}>
                <div className={`${styles.passwordStrengthBar} ${styles[passwordStrength]}`}></div>
              </div>
            )}
            {validation.password && (
              <div className={`${styles.validationMsg} ${validation.password.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className={styles.inputGroup}>
            <div className={`${styles.inputWrapper} ${validation.confirmPassword ? (validation.confirmPassword.valid ? styles.valid : styles.invalid) : ''}`}>
              <span className={styles.inputIcon}>🔐</span>
              <input
                type={showPassword.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
                onFocus={hideMessage}
                required
                minLength="8"
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => togglePassword('confirmPassword')}
              >
                <span>{showPassword.confirmPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
            {validation.confirmPassword && (
              <div className={`${styles.validationMsg} ${validation.confirmPassword.valid ? styles.success : styles.error} ${styles.show}`}>
                {validation.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Role Selector
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🎭</span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                onFocus={hideMessage}
                required
              >
                <option value="">Select your role</option>
                <option value="voter">Voter</option>
              </select>
            </div>
          </div> */}

          {/* Generate OTP Button */}
          <button
            type="button"
            className={`${styles.btn} ${styles.btnOutline} ${isLoading ? styles.loading : ''}`}
            onClick={handleGenerateOtp}
            disabled={isLoading}
          >
            <span style={{ opacity: isLoading ? 0 : 1 }}>🔑 Generate OTP</span>
          </button>

          {/* OTP Input */}
          {showOtp && (
            <div className={`${styles.otpContainer} ${styles.show}`}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className={`${styles.otpInput} ${digit ? styles.filled : ''}`}
                  maxLength="1"
                  id={`otp${index + 1}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                />
              ))}
            </div>
          )}
          {otpGenerated && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ opacity: isLoading ? 0 : 1 }}>check spam mails too!</span>
            </div>

          )}
          {/* Buttons */}
          <div className={styles.btnGroup}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              <span style={{ opacity: isLoading ? 0 : 1 }}>Sign Up</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate('/login')}
            >
              <span>Log In</span>
            </button>
          </div>

          <div className={styles.formLinks}>
            <Link to="/" className={styles.formLink}>Back to Home</Link>
          </div>
        </form>

        <div className={styles.divider}>
          <span>Secure Signup</span>
        </div>

        <div className={styles.loginFooter}>
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <Link to="/help">Need Help?</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
