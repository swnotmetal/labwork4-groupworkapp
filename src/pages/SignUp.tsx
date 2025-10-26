import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.ts';
import './SignUp.css'; // optional CSS file

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful! You can now log in.");
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding centered-content">
        <div className="signup-container">
          <div className="brand">
            <h1 className="brand-title">My Spot</h1>
          </div>

          {error && <IonText color="danger">{error}</IonText>}

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

          <IonButton expand="block" size="large" onClick={handleSignUp}>
            Create account
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
