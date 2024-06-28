import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Catalogo } from '../../models/catalogo.model';
import { Usuario } from '../../models/usuario.model';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { map } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { booleanValidator } from '../../services/Validator.service';

@Component({
  selector: 'app-crud-data-catalogo-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-data-catalogo-actualizar.component.html',
  styleUrl: './crud-data-catalogo-actualizar.component.css'
})
export class CrudDataCatalogoActualizarComponent {
 dataCatalogo: DataCatalogo={
  descripcion: "",
  estado: -1,
  usuarioPrestatario:{
    idUsuario:-1
  },
  usuarioRegistro:{
    idUsuario:-1
  },
 }
 formRegistrar = this.formBuilder.group({
  validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')], this.validaDescripcion.bind(this)],
    validaEstado: ['', [booleanValidator()]],
 });
 lstCatalogo: Catalogo[] = [];
 objUsuario: Usuario = {};

 constructor(private dataCatalogoService: DataCatalogoService,
            private utilService: UtilService,
            private tokenService: TokenService,
            private formBuilder: FormBuilder,
            @Inject(MAT_DIALOG_DATA) public data: DataCatalogo){
              this.dataCatalogo = data;
              console.log(">>> constructor  >>> ");
            }
ngOnInit(){
  console.log(">>> OnInit [inicio]");
      this.utilService.listaDescripcion().subscribe(
          x=> this.lstCatalogo = x
      );
      this.objUsuario.idUsuario = this.tokenService.getUserId();
      console.log(">>> OnInit >>> " + this.lstCatalogo);
      console.log(">>> OnInit [fin]");
}
actualizar() {
  console.log(">>> actualiza [inicio]");
  this.dataCatalogo.usuarioRegistro = this.objUsuario;
  console.log(">>> actualiza [inicio] " + this.dataCatalogo);


  this.dataCatalogoService.actualizarCrud(this.dataCatalogo).subscribe(
    x=>{
        Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
          this.dataCatalogo ={
                  descripcion: "",
                  estado:-1,
                  usuarioPrestatario: {
                      idUsuario: -1
                  },
                  usuarioRegistro: {
                      idUsuario: -1
                  },
              }
        }
   );
}
validaDescripcion(control: FormControl) {
  console.log(">>> validaDescripcion [inicio] " + control.value);

   return this.dataCatalogoService.validarNombreRegistro(control.value).pipe(
     map((resp: any) => {
          console.log(">>> validaDescripcion [resp] " + resp.valid);
          return (resp.valid) ? null : {existeDescripcion: true} ;
        })
    );
}
salir(){
}
}
