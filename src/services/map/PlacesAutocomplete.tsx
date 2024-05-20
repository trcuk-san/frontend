// google-map.tsx
import React, { useState, useRef, useCallback } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { Input } from "reactstrap";

const libraries: ("places")[] = ["places"];

const PlacesAutocomplete = ({ onPlaceSelected }: { onPlaceSelected: (place: google.maps.places.PlaceResult) => void }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDpy0LBeKaAtvgaGXfh2gRJ2KYO9bX5aYY", // ใส่ Google Maps API Key ของคุณที่นี่
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (place) {
      onPlaceSelected(place);
    }
  }, [onPlaceSelected]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <Input innerRef={inputRef} placeholder="Enter a location" />
    </Autocomplete>
  );
};

export default PlacesAutocomplete;
