import { Injectable, inject } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { SolicitudPrestamo } from '../models/solicitud-prestamo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudPrestamoService {
  private readonly baseUrl= AppSettings.API_ENDPOINT+ '/solicitudPrestamo';
  private http = inject(HttpClient)
  registrar(data:SolicitudPrestamo):Observable<any>{
    return this.http.post(`${this.baseUrl}`, data);
  }

}
