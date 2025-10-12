import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { trashOutline, listOutline } from 'ionicons/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { LatLng } from 'leaflet';
import { Spot, SpotCategory, CATEGORY_COLORS } from '../types/Spot';
import { loadSpots, addSpot, deleteSpot } from '../utils/storage';
import './MapPage.css';
import L from 'leaflet';
import MapController from '../components/MapController';

const MapPage = () => {
  // State management
  const [spots, setSpots] = useState<Spot[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [newSpotLocation, setNewSpotLocation] = useState<LatLng | null>(null);
  const [note, setNote] = useState('');
  const [emoji, setEmoji] = useState('📍');
  const [category, setCategory] = useState<SpotCategory>(SpotCategory.OTHER);
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null);

  // Load spots from localStorage when component mounts
  useEffect(() => {
    const savedSpots = loadSpots();
    setSpots(savedSpots);
  }, []);

  // Handle map click events to drop new pins
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setNewSpotLocation(e.latlng);
        setShowModal(true);
      },
    });
    return null;
  };

  // Navigate map to clicked spot location
  const handleSpotClick = (spot: Spot) => {
    setFlyToLocation([spot.lat, spot.lng]);
    setShowListModal(false);
  };

  // Save a new spot to storage
  const handleSaveSpot = () => {
    if (!newSpotLocation) {
      return;
    }

    const newSpotObj: Spot = {
      id: Date.now().toString(),
      lat: newSpotLocation.lat,
      lng: newSpotLocation.lng,
      note: note,
      emoji: emoji,
      category: category,
      createdAt: Date.now(),
    };

    addSpot(newSpotObj);
    setSpots(loadSpots());

    // Reset form
    setNote('');
    setEmoji('📍');
    setCategory(SpotCategory.OTHER);
    setNewSpotLocation(null);
    setShowModal(false);
  };

  // Delete a spot from storage
  const handleDeleteSpot = (id: string) => {
    deleteSpot(id);
    setSpots(loadSpots());
  };

  // Create custom markers with category-based colors and emoji
  const createCustomIcon = (spot: Spot) => {
    const color = CATEGORY_COLORS[spot.category];
    
    const html = `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        ${spot.emoji}
      </div>
    `;
    
    return L.divIcon({
      html: html,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Spots 📍</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-no-padding">
        {/* Map Container - centered on Helsinki */}
        <MapContainer 
          center={[60.1695, 24.9354]} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          {/* OpenStreetMap tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler />
          <MapController targetLocation={flyToLocation} zoom={17} />

          {/* Render all spot markers */}
          {spots.map((spot) => (
            <Marker 
              key={spot.id} position={[spot.lat, spot.lng]}
              icon={createCustomIcon(spot)}
            >
              <Popup>
                <div>
                  <strong>{spot.emoji}</strong> {spot.note}<br />
                  <span>{spot.category}</span>
                </div>
              </Popup>

            </Marker>
          ))}
          
        </MapContainer>

        {/* Floating Action Buttons */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="secondary" onClick={() => setShowListModal(true)}>
            <IonIcon icon={listOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal for adding new spot */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add New Spot</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Note</IonLabel>
              <IonInput
                value={note}
                onIonInput={(e) => setNote(e.detail.value!)}
                placeholder="What's special about this place?"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Emoji</IonLabel>
              <IonInput
                value={emoji}
                onIonInput={(e) => setEmoji(e.detail.value!)}
                placeholder="Pick an emoji 🎉"
              />
            </IonItem>

            <IonItem>
              <IonLabel>Category</IonLabel>
              <IonSelect value={category} onIonChange={(e) => setCategory(e.detail.value)}>
                <IonSelectOption value={SpotCategory.CAFE}>☕ Cafe</IonSelectOption>
                <IonSelectOption value={SpotCategory.PARK}>🌳 Park</IonSelectOption>
                <IonSelectOption value={SpotCategory.RESTAURANT}>🍽️ Restaurant</IonSelectOption>
                <IonSelectOption value={SpotCategory.SECRET}>🤫 Secret Spot</IonSelectOption>
                <IonSelectOption value={SpotCategory.OTHER}>📍 Other</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonButton expand="block" onClick={handleSaveSpot} className="ion-margin-top">
              Save Spot
            </IonButton>
            <IonButton expand="block" fill="outline" onClick={() => setShowModal(false)}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal for listing all spots */}
        <IonModal isOpen={showListModal} onDidDismiss={() => setShowListModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>My Saved Spots ({spots.length})</IonTitle>
              <IonButton slot='end' onClick={() => setShowListModal(false)} fill='clear'>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {spots.map((spot) => (
                <IonItemSliding key={spot.id}>
                  <IonItem button onClick={() => handleSpotClick(spot)}>
                    <IonLabel>
                      <h2>{spot.emoji} {spot.note}</h2>
                      <p>{spot.category}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => handleDeleteSpot(spot.id)}>
                      <IonIcon icon={trashOutline} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
            {spots.length === 0 && (
              <div className="ion-text-center ion-padding">
                <p>No spots saved yet! Tap on the map to add one.</p>
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MapPage;