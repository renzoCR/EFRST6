import { Injectable, inject } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { SolicitudPrestamo } from '../models/solicitud-prestamo.model';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudPrestamoService {
  private readonly baseUrl = AppSettings.API_ENDPOINT + '/solicitudPrestamo';
  private http = inject(HttpClient);
  registrar(data: SolicitudPrestamo): Observable<any> {
    if (data.idSolicitud) {
      return this.http.put(`${this.baseUrl}`, data);
    }
    return this.http.post(`${this.baseUrl}`, data);
  }
  buscarPorMonto(monto: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/listaMontoLike/${monto}`).pipe(
      map((list) => {
        return list;
      }),
      catchError((err) => throwError(() => err))
    );
  }
  cambiarEstado(soli: SolicitudPrestamo): Observable<any> {
    return this.http.put(`${this.baseUrl}/cambiar-estado`, soli).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((err) => throwError(() => err))
    );
  }
  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
