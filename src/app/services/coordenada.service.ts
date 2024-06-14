import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Coordenada } from '../models/coordenada.model';
import { Observable } from 'rxjs';



const baseUrl = AppSettings.API_ENDPOINT + '/coordenada';


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

}
