import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { DataCatalogo } from '../models/dataCatalogo.model';

const baseUrl = AppSettings.API_ENDPOINT+'/dataCatalogo';
const baseUrlCrudDataCatalogo = AppSettings.API_ENDPOINT + '/crudDataCatalogo';

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
  validaDescripcionActualiza(descripcion: string, id:number): Observable<any>{
    console.log('>>> Service >> validaDescripcionActualiza [inicio]' + descripcion);
    return this.http.get<any>(baseUrlCrudDataCatalogo+'/validaDescripcionActualiza?descripcion='+descripcion + "&idEjemplo="+id);
  }

  //
  registrarCrud(data:DataCatalogo):Observable<any>{
    return this.http.post(baseUrlCrudDataCatalogo+"/registraDataCatalogo", data);
  }
  actualizarCrud(data:DataCatalogo):Observable<any>{
    return this.http.put(baseUrlCrudDataCatalogo+"/actualizaDataCatalogo", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudDataCatalogo+"/eliminaDataCatalogo/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudDataCatalogo+"/listaDataCatalogoPorNombreLike/"+ filtro);
  }

}
