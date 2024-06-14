import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { DataCatalogo } from '../models/dataCatalogo.model';

const baseUrl = AppSettings.API_ENDPOINT+'/dataCatalogo';
@Injectable({
  providedIn: 'root'
})
export class DataCatalogoService {
  validaDescripcion(value: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private http:HttpClient) { }
  registro(bean:DataCatalogo):Observable<any>{
    return this.http.post(baseUrl,bean)
  }
  validarNombreRegistro(descripcion: string):Observable<any>{
    console.log('>>> Service >> validarNombreRegistro [inicio]' + descripcion);
    return this.http.get<any>(baseUrl+'/validarNombreRegistro?descripcion='+descripcion);
  }
}
