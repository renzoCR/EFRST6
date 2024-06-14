import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidad-financiera.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
const baseUrl = AppSettings.API_ENDPOINT+ '/entidad';
@Injectable({
  providedIn: 'root'
})
export class EntidadFinancieraService {

  constructor(private http:HttpClient) { }
  registro(bean:EntidadFinanciera):Observable<any>{
    console.log(baseUrl);

    return this.http.post(baseUrl,bean)
    
  }

  validarNombreRegistro(nombre: string):Observable<any>{
    console.log('>>> Service >> validarNombreRegistro [inicio]' + nombre);
    return this.http.get<any>(baseUrl+'/validarNombreRegistro?descripcion='+nombre);
  }

  validarGerenteRegistro(gerente: string):Observable<any>{
    console.log('>>> Service >> validarGerenteRegistro [inicio]' + gerente);
    return this.http.get<any>(baseUrl+'/validarGerenteRegistro?descripcion='+gerente);
  }
}
