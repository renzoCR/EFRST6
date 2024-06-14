import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { MontoPrestamo } from '../models/monto-prestamo.model';

const baseUrl = AppSettings.API_ENDPOINT+ '/montoPrestamo';
@Injectable({
  providedIn: 'root',
})
export class MontoPrestamoService {
  constructor(private http:HttpClient) { }
  registro(bean:MontoPrestamo):Observable<any>{
    return this.http.post(baseUrl,bean)
  }
  montoPrestamoListaPorDias(idDataCatalogo: number): Observable<any> {
    return this.http.get(`${baseUrl}/listaPorDias/${idDataCatalogo}`);
  }
}
