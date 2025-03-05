import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private readonly apiUrl = 'https://679b8dc433d31684632448c9.mockapi.io/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<Transport[]> {
    return this.http.get<Transport[]>(this.apiUrl);
  }

  // Filtros
  findServices(origin: string, destination: string, date: string): Observable<Transport[]> {
    return this.http.get<Transport[]>(
      `${this.apiUrl}?origin=${origin}&destination=${destination}&departureDate=${date}`
    );
  }

  // Get by id
  getService(id: string): Observable<Transport> {
    return this.http.get<Transport>(`${this.apiUrl}/${id}`);
  }
}