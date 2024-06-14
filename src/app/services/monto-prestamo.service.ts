import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { MontoPrestamo } from '../models/monto-prestamo.model';

@Injectable({
  providedIn: 'root',
})
export class MontoPrestamoService {
  private readonly baseUrl = AppSettings.API_ENDPOINT + '/montoPrestamo';
  private http = inject(HttpClient);
  montoPrestamoListaPorDias(dias: number): Observable<MontoPrestamo[]> {
    const url = `${this.baseUrl}/listaPorDias/${dias}`;
    return this.http.get<MontoPrestamo[]>(url).pipe(
      map((list) => {
        return list;
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
