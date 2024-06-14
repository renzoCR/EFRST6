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

  registrar(data: Usuario) : Observable<any> {
    return this.http.post(baseUrlPrueba , data);
  }
  validaDescripcionRegistra(descripcion: string): Observable<any> {
    console.log('>>> Service >> validaDescripcionRegistra [inicio]' + descripcion);
    return this.http.get<any>(baseUrlPrueba + '/validaDescripcionRegistra?descripcion=' + descripcion);
  }


}

