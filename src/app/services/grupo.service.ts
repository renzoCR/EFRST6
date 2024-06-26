import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Grupo } from '../models/grupo.model';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';

const baseUrl = AppSettings.API_ENDPOINT+ '/grupo';
const baseUrlCrud = AppSettings.API_ENDPOINT+ '/grupitoCrud';
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
  validarNombreActualiza(descripcion: string, id: number):Observable<any>{
    console.log('Service - validarNombreActualiza [inicio]' + descripcion);
    return this.http.get<any>(baseUrl+'/validaDescripcionActualiza?descripcion='+descripcion);
  }
  registrarGrupo(data:Grupo):Observable<any>{
    return this.http.post(baseUrlCrud+"/registrarGrupito", data);
  }
  listaGrupoPorNombreLike(data: String): Observable<any> {
    return this.http.get(baseUrlCrud+"/listaGrupoxNombreLike/" + data);
  }
  actualizarGrupo(data:Grupo):Observable<any>{
    return this.http.put(baseUrlCrud+"/actualizarGrupito", data);
  }
  eliminarGrupo(id:number):Observable<any>{
    return this.http.delete(baseUrlCrud+"/eliminarGrupito/"+id);
  }
}