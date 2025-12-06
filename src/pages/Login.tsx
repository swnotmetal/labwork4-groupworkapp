import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig.ts';
import { useIonRouter } from '@ionic/react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useIonRouter(); // 

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) setEmail(savedEmail);
    
    // Redirect to map if already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/map', 'forward');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) localStorage.setItem('email', email);
      else localStorage.removeItem('email');
      
      router.push('/map', 'forward');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding centered-content">
        <div className="auth-card login-container">
          <div className="brand">
            <h1 className="brand-title">My Spot</h1>
          </div>

          {error && <IonText color="danger" className="error-text">{error}</IonText>}

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

          <IonButton expand="block" size="large" onClick={handleLogin}>
            Log in
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
