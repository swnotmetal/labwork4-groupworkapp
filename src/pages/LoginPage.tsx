import './LoginPage.css';
<IonContent className="ion-padding login-container">
  <h2 className="login-title">Login</h2>
  <IonItem>
    <IonLabel position="stacked">Email</IonLabel>
    <IonInput/>
  </IonItem>
  <IonItem>
    <IonLabel position="stacked">Password</IonLabel>
    <IonInput/>
  </IonItem>
  <IonButton expand="block" className="login-button">
    Log In
  </IonButton>
</IonContent> // This is the main content area of the login page. 
// It includes a title, input fields for email and password, and a login button. 
// The class names are used for styling.

import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
import React, { useState } from 'react';

const LoginPage: React.FC = () => { // This defines my LoginPage component. Help to return the UI.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); //useState Stores my user types. Makes inputs controlled and I can use them later.

  const handleLogin = () => { // A placeholder function for login logic.
    console.log('Logging in with:', email, password);
    // You’ll connect this to Firebase later
  };

  return (
    <IonPage> // This wraps the whole screen, makes Ionic page work correctly.
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle> // This creates the top bar with the title “Login.”
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"> // Main scrollable area of a mobile application.This is where the form lives.
        <IonItem> // Helps with layout and styling.
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput type="email" value={email} />
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            required
          />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin}> // Full-width button that triggers login.
          Log In
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;