import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonSpinner
} from '@ionic/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig.ts';
import { useIonRouter } from '@ionic/react';
import * as yup from 'yup';
import './Login.css';

// Validation schemas
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Please enter your email address.'),
  password: yup
    .string()
    .required('Please enter your password.')
});

const passwordResetSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Please enter your email address first.')
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later or reset your password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs using Yup
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (validationError: any) {
      setError(validationError.errors[0]);
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) localStorage.setItem('email', email);
      else localStorage.removeItem('email');
      
      router.push('/map', 'forward');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    
    // Validate email using Yup
    try {
      await passwordResetSchema.validate({ email }, { abortEarly: false });
    } catch (validationError: any) {
      setError(validationError.errors[0]);
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      setError('');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding centered-content">
        <div className="auth-card login-container">
          <div className="brand">
            <h1 className="brand-title">My Spot</h1>
          </div>

          {error && (
            <div className="error-message">
              <IonText color="danger" className="error-text">
                <p>{error}</p>
              </IonText>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  inputmode="email"
                  autocomplete="email"
                  value={email}
                  onIonChange={e => setEmail(e.detail.value ?? '')}
                />
              </IonItem>
            </div>

            <div className="input-wrapper">
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  autocomplete="current-password"
                  value={password}
                  onIonChange={e => setPassword(e.detail.value ?? '')}
                />
              </IonItem>
            </div>

            <div className="row-between">
              <div className="remember-item">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <label htmlFor="remember-me" className="remember-label">
                  Remember me
                </label>
              </div>
              <button className="link-btn" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>
          </div>

          <IonButton 
            expand="block" 
            size="large" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <IonSpinner name="crescent" /> : 'Log in'}
          </IonButton>

          <div className="below-cta">
            <span>New here?</span>
            <button className="link-btn" onClick={() => router.push('/signup', 'forward')}>
              Create an account
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
