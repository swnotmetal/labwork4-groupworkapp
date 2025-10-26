import React, { useState } from 'react';
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.ts';
import * as yup from 'yup';
import './SignUp.css';

// Validation schema
const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address.')
    .required('Please enter your email address.'),
  password: yup
    .string()
    .required('Please enter a password.')
    .min(6, 'Password must be at least 6 characters long.')
    .min(8, 'For better security, use at least 8 characters.')
    .matches(/[a-zA-Z]/, 'Password should contain letters.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match. Please try again.')
});

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function for error messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Account creation is currently disabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many account creation attempts. Please try again later.';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  const handleSignUp = async () => {
    setError('');

    // Validate inputs using Yup
    try {
      await signupSchema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );
    } catch (validationError: any) {
      // Show the first validation error
      setError(validationError.errors[0]);
      return;
    }

    // Rate limiting check (simple client-side protection)
    const lastSignupAttempt = localStorage.getItem('lastSignupAttempt');
    if (lastSignupAttempt) {
      const timeSinceLastAttempt = Date.now() - parseInt(lastSignupAttempt);
      const cooldownPeriod = 60000; // 1 minute cooldown
      
      if (timeSinceLastAttempt < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastAttempt) / 1000);
        setError(`Please wait ${remainingTime} seconds before creating another account.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Store the attempt timestamp
      localStorage.setItem('lastSignupAttempt', Date.now().toString());
      
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful! You can now log in.");
      window.location.href = '/';
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
        <div className="signup-container">
          <div className="brand">
            <h1 className="brand-title">My Spot</h1>
          </div>

          {error && (
            <div className="error-message">
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            </div>
          )}

          <div className="form-group">
          <div className="input-wrapper">
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput inputmode="email" autocomplete="email" value={email} onIonChange={e => setEmail(e.detail.value ?? '')} />
            </IonItem>
          </div>

          <div className="input-wrapper">
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput type="password" autocomplete="new-password" value={password} onIonChange={e => setPassword(e.detail.value ?? '')} />
            </IonItem>
          </div>

          <div className="input-wrapper">
            <IonItem>
              <IonLabel position="floating">Confirm Password</IonLabel>
              <IonInput type="password" autocomplete="new-password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value ?? '')} />
            </IonItem>
          </div>
          </div>

          <IonButton 
            expand="block" 
            size="large" 
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? <IonSpinner name="crescent" /> : 'Create account'}
          </IonButton>

          <div className="below-cta" style={{ marginTop: 12, textAlign: 'center' }}>
            <span>Already have an account?</span>
            <button className="link-btn" onClick={() => window.location.href='/'}>Log in</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
