import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Reservation, Passenger } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io/reservations';

  constructor(private http: HttpClient) { }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    // HACER EL CODIGO DE RESERVA
    reservation.reservationCode = this.generateReservationCode(
      reservation.firstName,
      reservation.lastName,
      reservation.document
    );
    
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  // LA VALIDACION ASYNC DEL DOCUMENTO
  checkDocumentValidator(serviceId: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const document = control.value;
      
      if (!document || !serviceId) {
        return of(null);
      }
      
      return this.getReservations().pipe(
        map(reservations => {
          const exists = reservations.some(
            res => res.service === serviceId && res.document === document
          );
          
          return exists ? { documentAlreadyReserved: true } : null;
        })
      );
    };
  }

  private generateReservationCode(firstName: string, lastName: string, document: string): string {
    // INICIALES DEL NOMBRE Y APE
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    // ULTIMOS NUMEROS DEL DOCUMENTO
    const lastThreeDigits = document.substring(Math.max(0, document.length - 3));
    
    // RELLENAR
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `${firstInitial}${lastInitial}${lastThreeDigits}-${uniqueId}`;
  }
}