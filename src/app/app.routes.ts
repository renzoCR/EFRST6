import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { IndexComponent } from './index/index.component';

import { AgregarEjemploComponent } from './components/agregar-ejemplo/agregar-ejemplo.component';
import { AgregarCoordenadaComponent } from './components/agregar-coordenada/agregar-coordenada.component';
import { AgregarCuentaComponent } from './components/agregar-cuenta/agregar-cuenta.component';
import { AgregarDataCatalogoComponent } from './components/agregar-data-catalogo/agregar-data-catalogo.component';
import { AgregarEntidadFinancieraComponent } from './components/agregar-entidad-financiera/agregar-entidad-financiera.component';
import { AgregarGrupoComponent } from './components/agregar-grupo/agregar-grupo.component';
import { AgregarMontoPrestamoComponent } from './components/agregar-monto-prestamo/agregar-monto-prestamo.component';
import { AgregarPrestatarioComponent } from './components/agregar-prestatario/agregar-prestatario.component';
import { AgregarSolicitudPrestamoComponent } from './components/agregar-solicitud-prestamo/agregar-solicitud-prestamo.component';
import { CrudCuentaComponent } from './components/crud-cuenta/crud-cuenta.component';



export const routes: Routes = [
    {path:"verRegistroCoordenada", component:AgregarCoordenadaComponent },
    {path:"verRegistroCuenta", component:AgregarCuentaComponent },
    {path:"verRegistroDataCatalogo", component:AgregarDataCatalogoComponent },
    {path:"verRegistroEntidadFinanciera", component:AgregarEntidadFinancieraComponent },
    {path:"verRegistroGrupo", component:AgregarGrupoComponent },
    {path:"verRegistroMontoPrestamo", component:AgregarMontoPrestamoComponent },
    {path:"verRegistroPrestatario", component:AgregarPrestatarioComponent },
    {path:"verRegistroSolicitudPrestamo", component:AgregarSolicitudPrestamoComponent },
    {path:"verRegistroEjemplo", component:AgregarEjemploComponent },

    {path:"verCrudCuenta", component:CrudCuentaComponent },



    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];

