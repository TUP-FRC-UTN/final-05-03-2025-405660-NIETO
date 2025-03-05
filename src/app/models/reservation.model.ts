import { Passenger } from './passenger.model';

export interface Reservation {
  id?: string;
  document: string;
  firstName: string;
  lastName: string;
  service: string;
  reservationCode?: string;
  passengers: Passenger[];
}