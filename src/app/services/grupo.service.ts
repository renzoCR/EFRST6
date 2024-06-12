import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grupo } from '../models/grupo.model';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';

const baseUrl = AppSettings.API_ENDPOINT+ '/grupo';
@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private http:HttpClient) { }
  registro(bean:Grupo):Observable<any>{
    return this.http.post(baseUrl,bean)
  }

  validarNombreRegistro(descripcion: string):Observable<any>{
    console.log('>>> Service >> validarNombreRegistro [inicio]' + descripcion);
    return this.http.get<any>(baseUrl+'/validarNombreRegistro?descripcion='+descripcion);
  }
}