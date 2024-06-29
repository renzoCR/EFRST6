import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Coordenada } from '../models/coordenada.model';
import { Observable } from 'rxjs';



const baseUrl = AppSettings.API_ENDPOINT + '/coordenada';
const baseUrlCrud = AppSettings.API_ENDPOINT+ '/crudCoordenada';


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


  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrud+"/listaCoordenadaPorLatitudLike/"+ filtro);
  }

  listar():Observable<any>{
    return this.http.get(baseUrlCrud+"/listaCoordenadaPorLatitudLike/");
  }

  registrarCoordenada(data:Coordenada):Observable<any>{
    return this.http.post(baseUrlCrud+"/registrarCoordenada",data);
  }

  actualizarCoordenada(data:Coordenada,id:number): Observable<any>{
    return this.http.put(baseUrlCrud+"/actualizarCoordenada?id="+id, data);
  }

  eliminarCoordenada(id:number):Observable<any>{
    return this.http.delete(baseUrlCrud+"/eliminarCoordenada/"+ id)  
  }

}
