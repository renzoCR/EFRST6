import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Coordenada } from '../models/coordenada.model';
import { Observable } from 'rxjs';




const baseUrl = AppSettings.API_ENDPOINT + '/coordenada';
//consulta
const baseUrlConsultaCoordenada = AppSettings.API_ENDPOINT+ '/coordenadaConsulta';

@Injectable({
  providedIn: 'root'
})
export class CoordenadaService {

  constructor(private http:HttpClient) { }
  registrar(data:Coordenada,id:number):Observable<any>{
    let url = baseUrl + "?id=" + id;
    return this.http.post(url, data);
  }


  listaPrestamistariosTotales(): Observable<any>{
    return this.http.get(baseUrl + '/prestatarios',{});
  }

  //consulta
  consultaCoordenada(latitud: string, estado: number, idUbigeo: number): Observable<any>{
    const params = new HttpParams()
       .set("latitud", latitud)
       .set("estado", estado)
       .set("idUbigeo", idUbigeo);
   return this.http.get(baseUrlConsultaCoordenada+"/consultarCoordenada",{params});
  }


}
