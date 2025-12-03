import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './forgotPassword.module.css';

const ForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(null); // null | true | false
  const [otp, setOtp] = useState(Array(6).fill(''));
  const otpRefs = useRef([]);
  const [otpGenerated, setOtpGenerated] = useState(false);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // UI sections
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  // Passwords
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordValid, setNewPasswordValid] = useState(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);

  // Message
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error' | 'info'
  const messageTimeoutRef = useRef(null);

  // Button loading
  const [genLoading, setGenLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Ripple effects: track ripples per-button
  const [genRipples, setGenRipples] = useState([]);
  const [submitRipples, setSubmitRipples] = useState([]);

  // Derived
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const otpString = useMemo(() => otp.join(''), [otp]);

  // Clean message timeout
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerRunning) return;
    setTimeRemaining(60);
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const timerDisplay = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }, [timeRemaining]);

  // Message helper
  const showMessage = (text, type) => {
    setMessage({ text, type });
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  // Email validation on blur
  const handleEmailBlur = () => {
    if (!email) {
      setEmailValid(null);
      return;
    }
    setEmailValid(emailRegex.test(email));
  };

  // Generate / Resend OTP
  const handleGenerateOtp = (e) => {
    if (!email || !emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      setEmailValid(false);
      return;
    }
    // Ripple for this button
    addRipple(e, 'gen');

    setGenLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGenLoading(false);
      setOtpGenerated(true);
      setTimerRunning(true);
      setTimeRemaining(60);
      showMessage('OTP sent to your email! Please check your inbox.', 'success');
      // Focus first OTP box
      otpRefs.current?.[0]?.focus();
    }, 2000);
  };

  // Enable resend when timer complete (derived by timeRemaining & timerRunning)
  const canResend = !timerRunning && otpGenerated;

  // OTP handlers
  const handleOtpChange = (index, value) => {
    // allow only single char, typically digits but you can relax if needed
    const char = value.slice(-1);
    if (!char) {
      // deletion
      setOtp(prev => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }
    if (!/^\d$/.test(char)) return;

    setOtp(prev => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else {
      // Last digit filled
      maybeShowPasswordFields();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const next = Array(6).fill('');
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtp(next);
    // If complete, show password fields
    if (paste.length === 6) {
      maybeShowPasswordFields();
    } else {
      otpRefs.current[paste.length]?.focus();
    }
  };

  const maybeShowPasswordFields = () => {
    if (otpString.length === 6 && otpString.replace(/\D/g, '').length === 6) {
      showMessage('OTP verified! Please enter your new password.', 'success');
      setShowPasswordSection(true);
      setShowSubmit(true);
      setTimerRunning(false);
    }
  };

  // Password validations
  const handleNewPasswordBlur = () => {
    if (!newPassword) {
      setNewPasswordValid(null);
      return;
    }
    setNewPasswordValid(newPassword.length >= 8);
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setConfirmPasswordValid(null);
      return;
    }
    setConfirmPasswordValid(confirmPassword === newPassword);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (otpString.length !== 6) {
      showMessage('Please enter the complete OTP', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showMessage('Password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    setSubmitLoading(true);
    setTimeout(() => {
      setSubmitLoading(false);
      showMessage('Password reset successful! Redirecting to login...', 'success');
      // navigate('/login'); // uncomment if using react-router
    }, 2000);
  };

  // Ripple helpers
  const addRipple = (e, which) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Math.random().toString(36).slice(2);

    const ripple = { id, size, x, y };

    if (which === 'gen') {
      setGenRipples(prev => [...prev, ripple]);
      setTimeout(() => setGenRipples(prev => prev.filter(r => r.id !== id)), 600);
    } else {
      setSubmitRipples(prev => [...prev, ripple]);
      setTimeout(() => setSubmitRipples(prev => prev.filter(r => r.id !== id)), 600);
    }
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <div className={styles['login-header']}>
          <div className={styles['logo-container']}>🔐</div>
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your email and we'll send you a code to reset your password.</p>
        </div>

        {/* Message */}
        {message.text ? (
          <div className={`${styles.message} ${styles[message.type]} ${styles.show}`}>{message.text}</div>
        ) : (
          <div id="message" className={styles.message} aria-live="polite" />
        )}

        <form className={styles['login-form']} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles['input-group']}>
            <div
              className={[
                styles['input-wrapper'],
                emailValid === true ? styles.valid : '',
                emailValid === false ? styles.invalid : '',
              ].filter(Boolean).join(' ')}
            >
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
                onBlur={handleEmailBlur}
                disabled={otpGenerated} // disable after OTP generation
                style={otpGenerated ? { opacity: 0.6 } : undefined}
              />
              <label htmlFor="email">Email Address</label>
            </div>
            <div
              className={[
                styles['validation-msg'],
                emailValid === true ? `${styles.success} ${styles.show}` : '',
                emailValid === false ? `${styles.error} ${styles.show}` : '',
              ].filter(Boolean).join(' ')}
            >
              {emailValid === true ? 'Valid email' : emailValid === false ? 'Please enter a valid email address' : ''}
            </div>
          </div>

          {/* Generate / Resend OTP */}
          <button
            type="button"
            id="generateOtpBtn"
            className={`${styles.btn} ${styles['btn-outline']} ${genLoading ? styles.loading : ''}`}
            onClick={handleGenerateOtp}
            disabled={genLoading || (otpGenerated && !canResend)}
          >
            <span>{otpGenerated ? (canResend ? 'Resend OTP' : 'Resend in progress') : '🔑 Generate OTP'}</span>
            {/* ripples */}
            {genRipples.map(r => (
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

          {/* Timer */}
          <div className={`${styles['timer-container']} ${timerRunning ? styles.show : ''}`}>
            <span className={styles['timer-text']}>Resend OTP in</span>
            <span className={styles['timer-count']} id="timerDisplay">{timerDisplay}</span>
          </div>

          {/* OTP */}
          <div className={`${styles['otp-container']} ${otpGenerated ? styles.show : ''}`} onPaste={handleOtpPaste}>
            {otp.map((val, idx) => (
              <input
                key={idx}
                type="text"
                className={`${styles['otp-input']} ${val ? styles.filled : ''}`}
                maxLength={1}
                value={val}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                ref={(el) => (otpRefs.current[idx] = el)}
                disabled={showPasswordSection}
                style={showPasswordSection ? { opacity: 0.6 } : undefined}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>

          {/* Password section */}
          <div className={`${styles['hidden-section']} ${showPasswordSection ? styles.show : ''}`}>
            {/* New password */}
            <div className={styles['input-group']}>
              <div
                className={[
                  styles['input-wrapper'],
                  newPasswordValid === true ? styles.valid : '',
                  newPasswordValid === false ? styles.invalid : '',
                ].filter(Boolean).join(' ')}
              >
                <span className={styles['input-icon']}>🔒</span>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  placeholder=" "
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={handleNewPasswordBlur}
                />
                <label htmlFor="newPassword">New Password (min 8 characters)</label>
                <button
                  type="button"
                  className={styles['password-toggle']}
                  onClick={() => setShowNewPassword(v => !v)}
                  aria-label="Toggle new password visibility"
                >
                  <span>{showNewPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
              <div
                className={[
                  styles['validation-msg'],
                  newPasswordValid === true ? `${styles.success} ${styles.show}` : '',
                  newPasswordValid === false ? `${styles.error} ${styles.show}` : '',
                ].filter(Boolean).join(' ')}
              >
                {newPasswordValid === true
                  ? 'Strong password'
                  : newPasswordValid === false
                  ? 'Password must be at least 8 characters'
                  : ''}
              </div>
            </div>

            {/* Confirm password */}
            <div className={styles['input-group']}>
              <div
                className={[
                  styles['input-wrapper'],
                  confirmPasswordValid === true ? styles.valid : '',
                  confirmPasswordValid === false ? styles.invalid : '',
                ].filter(Boolean).join(' ')}
              >
                <span className={styles['input-icon']}>🔐</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder=" "
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <button
                  type="button"
                  className={styles['password-toggle']}
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label="Toggle confirm password visibility"
                >
                  <span>{showConfirmPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
              <div
                className={[
                  styles['validation-msg'],
                  confirmPasswordValid === true ? `${styles.success} ${styles.show}` : '',
                  confirmPasswordValid === false ? `${styles.error} ${styles.show}` : '',
                ].filter(Boolean).join(' ')}
              >
                {confirmPasswordValid === true
                  ? 'Passwords match'
                  : confirmPasswordValid === false
                  ? 'Passwords do not match'
                  : ''}
              </div>
            </div>
          </div>

          {/* Submit */}
          {showSubmit && (
            <div className={styles['btn-group']} id="submitBtnGroup">
              <button
                type="submit"
                className={`${styles.btn} ${styles['btn-primary']} ${submitLoading ? styles.loading : ''}`}
                id="submitBtn"
                onClick={(e) => addRipple(e, 'submit')}
              >
                <span>Reset Password</span>
                {submitRipples.map(r => (
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
            </div>
          )}

          {/* Back link */}
          <div className={styles['form-links']}>
            {/* Use react-router Link if available */}
            <a href="/login" className={styles['form-link']}>← Back to Login</a>
          </div>
        </form>

        <div className={styles.divider}>
          <span>Secure Password Reset</span>
        </div>

        <div className={styles['login-footer']}>
          <p>
            Remember your password? <a href="/login">Log in here</a>
          </p>
          <a href="/help">Need Help?</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
