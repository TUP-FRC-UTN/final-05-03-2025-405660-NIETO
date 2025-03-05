import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { City, Transport, Passenger, Reservation } from '../models';
import { CityService } from '../services/city.service';
import { TransportService } from '../services/transport.service';
import { ReservationService } from '../services/reservation.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {
  searchForm!: FormGroup;
  reservationForm!: FormGroup;
  cities: City[] = [];
  availableServices: Transport[] = [];
  destinationCities: City[] = [];
  
  loading = false;
  searchPerformed = false;
  searchError = false;
  reservationSuccess = false;
  reservationError = false;
  
  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private transportService: TransportService,
    private reservationService: ReservationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initReservationForm();
    this.loadCities();
  }

  private loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.destinationCities = [...cities];
      },
      error: (error) => {
        console.error('Error cargando ciudades:', error);
      }
    });
  }

  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required]
    });

    // Chequear las ciudades de origen cuando cambia para la validacion
    this.searchForm.get('origin')?.valueChanges.subscribe(value => {
      this.updateDestinationCities(value);
    });
  }

  private initReservationForm(): void {
    this.reservationForm = this.fb.group({
      serviceId: ['', Validators.required],
      document: ['', [
        Validators.required, 
        Validators.minLength(6), 
        Validators.pattern('^[0-9]*$')
      ]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      passengers: this.fb.array([])
    });

    // Validacion del doc para cuando se cambia el servicio
    this.reservationForm.get('serviceId')?.valueChanges.subscribe(serviceId => {
      if (serviceId) {
        const documentControl = this.reservationForm.get('document');
        if (documentControl) {
          documentControl.setAsyncValidators(
            this.reservationService.checkDocumentValidator(serviceId)
          );
          documentControl.updateValueAndValidity();
        }
      }
    });
  }

  get passengers(): FormArray {
    return this.reservationForm.get('passengers') as FormArray;
  }

  addPassenger(): void {
    const passengerForm = this.fb.group({
      document: ['', [
        Validators.required, 
        Validators.minLength(6), 
        Validators.pattern('^[0-9]*$')
      ]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
    
    this.passengers.push(passengerForm);
  }

  removePassenger(index: number): void {
    this.passengers.removeAt(index);
  }

  updateDestinationCities(originId: string): void {
    if (!originId) {
      this.destinationCities = [...this.cities];
      return;
    }
    
    this.destinationCities = this.cities.filter(city => city.id !== originId);
    
    // Origen y destino se resetean si son iguales
    const currentDestination = this.searchForm.get('destination')?.value;
    if (currentDestination === originId) {
      this.searchForm.get('destination')?.setValue('');
    }
  }

  searchServices(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.searchError = false;
      this.searchPerformed = true;
      this.availableServices = [];
      
      const { origin, destination, date } = this.searchForm.value;
      
      this.transportService.findServices(origin, destination, date)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (services) => {
            this.availableServices = services;
            if (services.length > 0) {
              // Reiniciar el form reserva
              this.reservationForm.reset();
              this.reservationForm.get('passengers')?.value.forEach((_: any, index: number) => {
                this.removePassenger(index);
              });
            }
          },
          error: (error) => {
            console.error('Error buscando servicios:', error);
            this.searchError = true;
          }
        });
    }
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      this.loading = true;
      this.reservationError = false;
      this.reservationSuccess = false;
      
      const formValues = this.reservationForm.value;
      
      // Preparar los datos para la reserva
      const passengersList: Passenger[] = [...formValues.passengers];
      
      // Agregar al titular como pasajero principal
      passengersList.unshift({
        document: formValues.document,
        firstName: formValues.firstName,
        lastName: formValues.lastName
      });
      
      const reservation: Reservation = {
        document: formValues.document,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        service: formValues.serviceId,
        passengers: passengersList
      };
      
      this.reservationService.createReservation(reservation)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (response) => {
            console.log('Reserva creada:', response);
            this.reservationSuccess = true;
            
            // Mandar a la lista desp de que lo manda
            setTimeout(() => {
              this.router.navigate(['/list']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error creando reserva:', error);
            this.reservationError = true;
          }
        });
    }
  }
}