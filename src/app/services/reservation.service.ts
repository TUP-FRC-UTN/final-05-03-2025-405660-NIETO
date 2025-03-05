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
    // Generar código de reserva
    reservation.reservationCode = this.generateReservationCode(
      reservation.firstName,
      reservation.lastName,
      reservation.document
    );
    
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  // Validador asíncrono para verificar si un documento ya tiene una reserva para un servicio
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

  // Método para generar el código de reserva
  private generateReservationCode(firstName: string, lastName: string, document: string): string {
    // Obtener iniciales
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    // Obtener últimos 3 dígitos del documento
    const lastThreeDigits = document.substring(Math.max(0, document.length - 3));
    
    // Generar un identificador único
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Formato: <Iniciales><Últimos 3 Dígitos>-<Identificador Único>
    return `${firstInitial}${lastInitial}${lastThreeDigits}-${uniqueId}`;
  }
}