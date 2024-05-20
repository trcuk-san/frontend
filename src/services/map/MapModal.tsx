import React, { useRef, useState, useCallback } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
}

const libraries: ("places")[] = ["places"];

const MapModal: React.FC<MapModalProps> = ({ isOpen, toggle, onSelectLocation }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({ lat: 13.721669430532575, lng: 100.52406649311321 });
  const [address, setAddress] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyD01Tc1PUR7gyHVmP46JA6JjBerk2-kAPM",
    libraries,
  });

  const onMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      console.log("Marker position set to:", { lat, lng });

      // Fetch the address using reverse geocoding
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      } else {
        console.error("No results found for the given location.");
      }
    }
  }, []);

  const onSaveLocation = () => {
    console.log("Saving location:", { ...markerPosition, address });
    onSelectLocation({ ...markerPosition, address });
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Select Location</ModalHeader>
      <ModalBody>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={10}
            onClick={onMapClick}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
        <Button color="primary" onClick={onSaveLocation}>
          Save Location
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default MapModal;
