import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidad-financiera.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrl = AppSettings.API_ENDPOINT+ '/entidad';
const baseUrlCrud = AppSettings.API_ENDPOINT+ '/crudEntidad';
const baseUrlConsulta = AppSettings.API_ENDPOINT + '/consultaEntidad';

@Injectable({
  providedIn: 'root'
})
export class EntidadFinancieraService {

  constructor(private http:HttpClient) { }
  registro(bean:EntidadFinanciera):Observable<any>{
    console.log(baseUrl);

    return this.http.post(baseUrl,bean)
    
  }

  validarNombreRegistro(nombre: string): Observable<any> {
    console.log('>>> Service >> validarNombreRegistro [inicio]' + nombre);
    return this.http.get<any>(`${baseUrl}/validarNombreRegistro?nombre=${nombre}`);
  }
  

  validarGerenteRegistro(gerente: string):Observable<any>{
    console.log('>>> Service >> validarGerenteRegistro [inicio]' + gerente);
    return this.http.get<any>(baseUrl+'/validarGerenteRegistro?descripcion='+gerente);
  }

  //PC2: CRUD de Ejemplo
  registrarCrud(data:EntidadFinanciera):Observable<any>{
    return this.http.post(baseUrlCrud+"/registraEntidad", data);
  }
  actualizarCrud(data:EntidadFinanciera):Observable<any>{
    return this.http.put(baseUrlCrud+"/actualizaEntidad", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrud+"/eliminaEntidad/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrud+"/listaEntidadFinancieraPorNombreLike/"+ filtro);
  }
  //PC3: Consulta de Ejemplo
  
   consulta(nombre: string, gerente: string, tipoEntidad: number, estado: number): Observable<any>{
    const params = new HttpParams()
       .set("nombre", nombre)
       .set("gerente", gerente)
       .set("tipoEntidad", tipoEntidad)
       .set("estado", estado)
   return this.http.get(baseUrlConsulta+"/consultaComplejoEntidadFinanciera",{params});
  }
}
