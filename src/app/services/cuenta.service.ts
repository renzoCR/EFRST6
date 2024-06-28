import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/cuenta';
const baseUrlCrudPrueba = AppSettings.API_ENDPOINT + '/crudCuenta';
const baseUrlConsultaPrueba = AppSettings.API_ENDPOINT + '/consultaCuenta';


@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private http:HttpClient) { }

  registrar(data:Cuenta):Observable<any>{
    return this.http.post(baseUrlPrueba, data);
  }

  validaNumeroRegistra(numero: string): Observable<any>{
    console.log('>>> Service >> validaNumeroRegistra [inicio]' + numero);
    return this.http.get<any>(baseUrlPrueba+'/validaNumeroRegistra?numero='+numero);
  }

  validaNumeroActualiza(numero: string, id:number): Observable<any>{
    console.log('>>> Service >> validaNumeroActualiza [inicio]' + numero);
    return this.http.get<any>(baseUrlCrudPrueba+'/validaNumeroActualiza?descripcion='+numero + "&idCuenta="+id);
  }

  //crud PC2
  registrarCrud(data:Cuenta):Observable<any>{
    return this.http.post(baseUrlCrudPrueba+"/registraCuenta", data);
  }
  actualizarCrud(data:Cuenta):Observable<any>{
    return this.http.put(baseUrlCrudPrueba+"/actualizaCuenta", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudPrueba+"/eliminaCuenta/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudPrueba+"/listaCuentaPorNumeroLike/"+ filtro);
  }

  //Consulta EF
  consultaCuenta(numero: string, idDataCalogo: string, estado: number, idTipoMoneda: string): Observable<any>{
    console.log('>>> Service >> consultaCuenta [inicio]' + numero);
    return this.http.get<any>(baseUrlConsultaPrueba+'/consultaComplejoCuenta?numero='+numero + "&idDataCalogo="+idDataCalogo + "&estado="+estado+ "&idTipoMoneda="+idTipoMoneda );
  }

}
