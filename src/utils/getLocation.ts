/**
 * GPS coordinate capture for the alert flow.
 *
 * Foreground permission only — EVA never needs to track location in the
 * background, and asking for "always" access would both raise an
 * unnecessary red flag if an abuser reviews app permissions and expand the
 * privacy surface beyond what the feature requires.
 */
import * as Location from 'expo-location';

import { CoordinateFormat } from '@/utils/storage';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function getCurrentCoordinates(): Promise<Coordinates | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({});
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function toGoogleMapsLink({ latitude, longitude }: Coordinates): string {
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

function toDMS(value: number, positiveLabel: string, negativeLabel: string): string {
  const label = value >= 0 ? positiveLabel : negativeLabel;
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(1);
  return `${degrees}°${minutes}'${seconds}"${label}`;
}

/**
 * Coordinates are shown to the user in whichever format they picked in
 * Settings. Decimal degrees is the practical default (it's what the SMS
 * link uses under the hood); DMS is offered because it reads more legibly
 * to some people and matches what a dispatcher may ask for verbally.
 */
export function formatCoordinates(coords: Coordinates, format: CoordinateFormat): string {
  if (format === 'decimal') {
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  }
  const lat = toDMS(coords.latitude, 'N', 'S');
  const lng = toDMS(coords.longitude, 'E', 'W');
  return `${lat} ${lng}`;
}
