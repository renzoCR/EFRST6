import { Component, Inject, OnInit } from '@angular/core';

import Swal from 'sweetalert2'

import { Pais } from '../../models/pais.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { map } from 'rxjs';
import { Ubigeo } from '../../models/ubigeo.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { PrestatarioService } from '../../services/prestatario.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-prestatario-actualizar',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './crud-prestatario-actualizar.component.html',
  styleUrl: './crud-prestatario-actualizar.component.css',
})
export class CrudPrestatarioActualizarComponent {
  prestatario: Usuario = {
    nombres: "",
    apellidos: "",
    dni: 0,
    login: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    direccion: "",
    nombreCompleto: "",
    usuarioSuperior: -1,
    estado: 1,
    fechaRegistro: "",
    fechaActualizacion: "",
    usuarioRegistro: -1,
    usuarioActualiza: -1
  }

  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')]],
    validaApellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')]],
    validaUsuario: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')], this.validaLogin.bind(this)],
    validaCorreo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    validaLongitud: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')], this.validaDni.bind(this)],
    validaFecha: ['', [Validators.required]],
    validaDireccion: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.,# ]{3,200}')]]
  });


  //usuario en sesion
  objUsuario: Usuario = {};


  constructor(private prestatarioService: PrestatarioService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Usuario) {

    this.prestatario = data;
    console.log(">>> constructor  >>> ");
  }
  ngOnInit() {
    console.log(">>> OnInit [inicio]");
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(">>> OnInit [fin]");
  }


  actualiza() {
    console.log(">>> registra [inicio]");
    this.prestatario.usuarioActualiza = this.objUsuario.idUsuario;
    this.prestatario.usuarioRegistro = this.objUsuario.idUsuario;
    this.prestatario.usuarioSuperior = this.objUsuario.idUsuario;


    console.log(">>> registra [inicio] " + this.prestatario);
    console.log(">>> Nombres " + this.prestatario.nombres);
    console.log(">>> fecha de nacimiento ", this.prestatario.fechaNacimiento);




    this.prestatarioService.actualizarCrud(this.prestatario).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
        this.prestatario = {
          nombres: "",
          apellidos: "",
          dni: 0,
          login: "",
          correo: "",
          password: "",
          fechaNacimiento: "",
          direccion: "",
          nombreCompleto: "",
          usuarioSuperior: -1,
          estado: 1,
          fechaRegistro: "",
          fechaActualizacion: "",
          usuarioRegistro: -1,
          usuarioActualiza: -1
        }
      }
    );
  }

  validaDni(control: FormControl) {
    console.log(">>> validaDni[inicio] " + control.value);

    return this.prestatarioService.validaDniActualiza(control.value, this.prestatario.idUsuario || 0).pipe(
      map((resp: any) => {
        console.log(">>> validaDni [resp] " + resp.valid);
        return (resp.valid) ? null : { existeDni: true };
      })
    );
  }
  validaLogin(control: FormControl) {
    console.log(">>> validaLogin[inicio] " + control.value);

    return this.prestatarioService.validaLoginActualiza(control.value, this.prestatario.idUsuario || 0).pipe(
      map((resp: any) => {
        console.log(">>> validaLogin [resp] " + resp.valid);
        return (resp.valid) ? null : { existeLogin: true };
      })
    );
  }

  salir() {

  }

}






