import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';



const baseUrlPrueba = AppSettings.API_ENDPOINT + '/prestatario';

@Injectable({
  providedIn: 'root'
})
export class PrestatarioService {

  constructor(private http: HttpClient) { }

  registrar(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrar", data);
  }
  validaDniRegistra(dni: number): Observable<any> {
    console.log('>>> Service >> validaDniRegistra [inicio]' + dni);
    return this.http.get<any>(baseUrlPrueba + '/validaDniRegistra?dni=' + dni);
  }
  validaLoginRegistra(login: string): Observable<any> {
    console.log('>>> Service >> validaLoginRegistra [inicio]' + login);
    return this.http.get<any>(baseUrlPrueba + '/validaLoginRegistra?login=' + login);
  }
  validaDniActualiza(dni: number, idUsuario: number): Observable<any> {
    console.log('>>> Service >> validaDniActualiza [inicio]' + dni);
    return this.http.get<any>(baseUrlPrueba + '/validaDniActualiza?dni=' + dni + "&idUsuario=" + idUsuario);
  }
  validaLoginActualiza(login: string, idUsuario: number): Observable<any> {
    console.log('>>> Service >> validaLoginActualiza [inicio]' + login);
    return this.http.get<any>(baseUrlPrueba + '/validaLoginActualiza?login=' + login + "&idUsuario=" + idUsuario);
  }

  registrarCrud(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + "/registrar", data);
  }
  actualizarCrud(data: Usuario): Observable<any> {
    return this.http.put(baseUrlPrueba + "/actualizaPrestatario", data);
  }
  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlPrueba + "/eliminaPrestatario/" + id);
  }
  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlPrueba + "/listaPrestatarioPorNombreLike/" + filtro);
  }
  consultaPrestatario(nombres: string, estado: number, dni: number, login: string): Observable<any> {
    console.log('>>> Service >> consultaEjemplo [inicio]' + nombres);
    return this.http.get<any>(baseUrlPrueba + '/consultaComplejoEjemplo?nombres=' + nombres + "&estado=" + estado + "&dni=" + dni + "&login=" + login);
  }



}

