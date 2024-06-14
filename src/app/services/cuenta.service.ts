import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT+ '/cuenta';

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
}
