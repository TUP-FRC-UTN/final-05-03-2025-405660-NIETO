import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation, Transport } from '../models';
import { ReservationService } from '../services/reservation.service';
import { TransportService } from '../services/transport.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];
  transportDetails: { [key: string]: Transport } = {};
  loading = true;
  error = false;

  constructor(
    private reservationService: ReservationService,
    private transportService: TransportService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = false;

    this.reservationService.getReservations().pipe(
      switchMap(reservations => {
        this.reservations = reservations;
        
        // IF no hay reservas
        if (reservations.length === 0) {
          return of(null);
        }
        
        // Get detalle de transporte para cada reserva
        const uniqueServiceIds = [...new Set(reservations.map(r => r.service))];
        const serviceRequests = uniqueServiceIds.map(serviceId => 
          this.transportService.getService(serviceId).pipe(
            catchError(() => of(null))
          )
        );
        
        return forkJoin(serviceRequests);
      }),
      catchError(error => {
        console.error('Error cargando reservas:', error);
        this.error = true;
        return of(null);
      })
    ).subscribe(services => {
      this.loading = false;
      
      if (services) {
        services.forEach(service => {
          if (service) {
            this.transportDetails[service.id] = service;
          }
        });
      }
    });
  }

  getDepartureInfo(serviceId: string): string {
    const service = this.transportDetails[serviceId];
    if (!service) {
      return 'No disponible';
    }
    return `${service.departureDate} ${service.departureTime}`;
  }
}