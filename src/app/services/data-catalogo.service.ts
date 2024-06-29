import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { DataCatalogo } from '../models/dataCatalogo.model';

const baseUrl = AppSettings.API_ENDPOINT+'/dataCatalogo';
const baseUrlCrudDataCatalogo = AppSettings.API_ENDPOINT + '/crudDataCatalogo';
const baseUrlConsultaDataCatalogo = AppSettings.API_ENDPOINT + '/dataCatalogoConsulta';

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

  // consultar
  /*consultaDataCatalogo(descripcion:string, estado:number, idCatalogo:number): Observable<any>{
    const params = new HttpParams()
        .set("descripcion", descripcion)
        .set("estado",estado)
        .set("idCatalogo",idCatalogo);
    return this.http.get(baseUrlConsultaDataCatalogo+"/consultaComplejoDataCatalogo",{params});
  }*/
   /*consultaDataCatalogo(descripcion: string, idCatalogo: number, estado: number): Observable<any> {
      const params = new HttpParams()
          .set('descripcion', descripcion)
          .set('idCatalogo', idCatalogo.toString())
          .set('estado', estado.toString());
  
          return this.http.get<DataCatalogo[]>('/api/url/consultaComplejoDataCatalogo/consultaComplejoDataCatalogo', { params });
        
  }*/
   consultaDataCatalogo(descripcion: string, idCatalogo: number, estado: number): Observable<DataCatalogo[]> {
            const params = new HttpParams()
              .set('descripcion', descripcion)
              .set('idCatalogo', idCatalogo.toString())
              .set('estado', estado.toString());
        
            return this.http.get<DataCatalogo[]>(`${baseUrlConsultaDataCatalogo}/consultaComplejoDataCatalogo`, { params });
          }
}
