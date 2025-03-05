import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly apiUrl = 'https://679b8dc433d31684632448c9.mockapi.io/cities';

  constructor(private http: HttpClient) { }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.apiUrl);
  }
}