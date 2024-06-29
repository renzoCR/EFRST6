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
    return this.http.post(baseUrl+"/registrar",bean)
  }
  actualizar(bean:MontoPrestamo):Observable<any>{
    return this.http.put(baseUrl+"/actualizar",bean)
  }
  eliminar(id:number):Observable<any>{
    return this.http.delete(baseUrl+"/eliminar/"+id)
  }
  montoPrestamoListaPorDias(dia: string): Observable<any> {
    return this.http.get(`${baseUrl}/listaPorDias/${dia}`);
  }
  lista(): Observable<any> {
    return this.http.get(baseUrl+"/listar");
  }
  consulta(dia:string,capital:string,monto:string,estado:number): Observable<any> {
    return this.http.get(baseUrl+"/consulta?dias="+dia+"&capital="+capital+"&monto="+monto+"&estado="+estado);
  }
}
