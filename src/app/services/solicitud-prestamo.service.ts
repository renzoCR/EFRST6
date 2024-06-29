import { Injectable, inject } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  buscarComplejo(soli: any): Observable<any> {
    const {
      capital,
      dias,
      montoPagar,
      fechaInicioPrestamo,
      fechaFinPrestamo,
      estado,
    } = soli;
    const fechaIFormateada = this.formatDateString(fechaInicioPrestamo!);
    const fechaFFormateada = this.formatDateString(fechaFinPrestamo!);
    const cap: any = capital;

    const params = new HttpParams()
      .set('capital', cap!)
      .set('dias', dias!)
      .set('montoPagar', montoPagar!)
      .set('fechaInicioPrestamo', fechaIFormateada!)
      .set('fechaFinPrestamo', fechaFFormateada!)
      .set('estado', estado! ? 1 : 0);
    return this.http.get(`${this.baseUrl}/listar-complejo`, { params }).pipe(
      map((list) => {
        return list;
      }),
      catchError((err) => throwError(() => err))
    );
  }
  generateDocumentReport(soli: any): Observable<any> {
    const {
      capital,
      dias,
      montoPagar,
      fechaInicioPrestamo,
      fechaFinPrestamo,
      estado,
    } = soli;
    const fechaIFormateada = this.formatDateString(fechaInicioPrestamo!);
    const fechaFFormateada = this.formatDateString(fechaFinPrestamo!);
    const cap: any = capital;
    const params = new HttpParams()
      .set('capital', cap!)
      .set('dias', dias!)
      .set('montoPagar', montoPagar!)
      .set('fechaInicioPrestamo', fechaIFormateada!)
      .set('fechaFinPrestamo', fechaFFormateada!)
      .set('estado', estado! ? 1 : 0);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http
      .post(
        `${this.baseUrl}/reporteRevistaPDF?capital=${cap}&dias=${dias}
        &montoPagar=${montoPagar}&fechaInicioPrestamo=${fechaIFormateada}
        &fechaFinPrestamo=${fechaFFormateada}&estado=${estado! ? 1 : 0}`,
        '',
        requestOptions
      )
      .pipe(
        map((response) => {
          return {
            filename: 'reporte.pdf',
            data: new Blob([response], { type: 'application/pdf' }),
          };
        })
      );
  }
  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // getMonth() is zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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
