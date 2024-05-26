import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD01Tc1PUR7gyHVmP46JA6JjBerk2-kAPM';

interface LatLng {
  lat: number;
  lng: number;
}

interface DistanceMatrixElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}

interface DistanceMatrixRow {
  elements: DistanceMatrixElement[];
}

interface DistanceMatrixResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: DistanceMatrixRow[];
  status: string;
}

export const getDistanceMatrix = async (origins: LatLng[], destinations: LatLng[]): Promise<DistanceMatrixResponse> => {
  const originStr = origins.map(({ lat, lng }) => `${lat},${lng}`).join('|');
  const destinationStr = destinations.map(({ lat, lng }) => `${lat},${lng}`).join('|');
  const response = await axios.get('http://localhost:4000/order/distanceMatrix', {
    params: {
      origins: originStr,
      destinations: destinationStr,
    },
  });

  if (!response.data || response.data.status !== 'OK') {
    throw new Error('Invalid distance matrix response structure');
  }

  return response.data;
};

export const sortDropOffsByDistance = async (dropOffs: string[]): Promise<string[]> => {
  const origin = { lat: 13.559385, lng: 100.674913 };

  const destinations = dropOffs.map((dropOff) => {
    const [lat, lng] = dropOff.split(',').map(Number);
    return { lat, lng };
  });

  const distanceMatrix = await getDistanceMatrix([origin], destinations);

  const distances = distanceMatrix.rows[0].elements.map((element, index) => ({
    distance: element.distance.value,
    location: dropOffs[index],
  }));

  distances.sort((a, b) => a.distance - b.distance);

  return distances.map((item) => item.location);
};

export const getGeocodeAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${lat},${lng}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      });
  
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error('Invalid geocode response');
      }
    } catch (error: unknown) {
      console.error('Error fetching geocode address:', error);
      throw error;
    }
  };