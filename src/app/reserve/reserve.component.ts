import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { City, Transport, Passenger } from '../models';

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
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initSearchForm();
    this.initReservationForm();
    // TODO CARGAR LAS CUIDADES CON EL SERVICIO
  }

  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required]
    });

    // Cuando se cambia el origen, actualizamos las ciudades de destino disponibles
    this.searchForm.get('origin')?.valueChanges.subscribe(value => {
      this.updateDestinationCities(value);
    });
  }

  private initReservationForm(): void {
    this.reservationForm = this.fb.group({
      serviceId: ['', Validators.required],
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      passengers: this.fb.array([])
    });
  }

  get passengers(): FormArray {
    return this.reservationForm.get('passengers') as FormArray;
  }

  addPassenger(): void {
    const passengerForm = this.fb.group({
      document: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')]],
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
      this.destinationCities = this.cities;
      return;
    }
    
    this.destinationCities = this.cities.filter(city => city.id !== originId);
    
    // Resetear el destino si está seleccionado como origen
    const currentDestination = this.searchForm.get('destination')?.value;
    if (currentDestination === originId) {
      this.searchForm.get('destination')?.setValue('');
    }
  }

  searchServices(): void {
    if (this.searchForm.valid) {
      // TODO: busqueda de servicios cuando creemos el servicio
    }
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      // TODO envío de la reserva cuando creemos el servicio
    }
  }
}