import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
  IonText,
  IonChip,
  IonIcon
} from '@ionic/react';
import { logOutOutline, mapOutline } from 'ionicons/icons';
import { useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Spot, SpotCategory, CATEGORY_COLORS } from '../types/Spot';
import { loadSpots } from '../utils/storage';
import './MyProfile.css';

const MyProfile: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const router = useIonRouter();

  // Authentication guard - redirect to login if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect if we're actually on the profile page and not navigating away
      if (!user && window.location.pathname === '/profile') {
        router.push('/login', 'back');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load spots when component mounts
  useEffect(() => {
    const savedSpots = loadSpots();
    setSpots(savedSpots);
  }, []);

  // Reload spots every time the page is viewed (when navigating back from map)
  useIonViewWillEnter(() => {
    const savedSpots = loadSpots();
    setSpots(savedSpots);
  });

  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email || 'Anonymous explorer';

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login', 'back');
  };

  const goToMap = () => {
    console.log('goToMap called, navigating to /map');
    // Use router.push exactly like in Login page
    router.push('/map', 'forward');
  };

  const countByCategory = (category: SpotCategory) =>
    spots.filter((s) => s.category === category).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <span>{initials}</span>
          </IonAvatar>
          <div className="profile-info">
            <h2>{displayName}</h2>
            {user?.email && (
              <IonText color="medium">
                <p>{user.email}</p>
              </IonText>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <IonButton 
            expand="block" 
            color="primary" 
            onClick={() => router.push('/map', 'forward')}
          >
            <IonIcon icon={mapOutline} slot="start" />
            Back to map
          </IonButton>
          <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Log out
          </IonButton>
        </div>

        <div className="profile-stats">
          <h3>Saved spots overview</h3>
          <IonText>
            <p>You have {spots.length} saved spot{spots.length === 1 ? '' : 's'}.</p>
          </IonText>
          <div className="category-chips">
            {Object.values(SpotCategory).map((cat) => (
              <IonChip
                key={cat}
                style={{
                  '--background': CATEGORY_COLORS[cat as SpotCategory],
                  color: '#fff'
                }}
              >
                <IonLabel>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({countByCategory(cat as SpotCategory)})
                </IonLabel>
              </IonChip>
            ))}
          </div>
        </div>

        <h3>My saved spots</h3>
        {spots.length === 0 ? (
          <div className="ion-text-center ion-padding">
            <IonText color="medium">
              <p>No spots saved yet. Head to the map and tap to add your first one!</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {spots
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((spot) => (
                <IonItem key={spot.id}>
                  <IonLabel>
                    <h2>
                      {spot.emoji} {spot.note || 'Untitled spot'}
                    </h2>
                    <p>
                      {spot.category} • Saved on{' '}
                      {new Date(spot.createdAt).toLocaleDateString()}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;


