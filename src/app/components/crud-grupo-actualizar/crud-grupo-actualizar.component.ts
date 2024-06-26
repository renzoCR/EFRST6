import { Component, Inject } from '@angular/core';
import { Grupo } from '../../models/grupo.model';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Usuario } from '../../models/usuario.model';
import { Ubigeo } from '../../models/ubigeo.model';
import { GrupoService } from '../../services/grupo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { map } from 'rxjs';

@Component({
   selector: 'app-crud-grupo-actualizar',
   standalone: true,
   imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
   templateUrl: './crud-grupo-actualizar.component.html',
   styleUrl: './crud-grupo-actualizar.component.css'
})
export class CrudGrupoActualizarComponent {
   grupo: Grupo = {
      "descripcion": "",
      "ubigeo": {
      idUbigeo: -1,
      departamento: "-1",
      provincia: "-1",
      distrito: "",
      },
      "usuarioLider": { "idUsuario": -1 },
      "usuarioRegistro": { "idUsuario": -1 },
      "usuarioActualiza": { "idUsuario": -1 },
   }
   formRegistrar = this.formBuilder.group({
   validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')],
   this.validaDescripcion.bind(this)],
   validaDepartamento: ['', [Validators.required, Validators.min(1)]],
   validaProvincia: ['', [Validators.required, Validators.min(1)]],
   validaDistrito: ['', [Validators.required, Validators.min(1)]],
   validaLider: ['', [Validators.required, Validators.min(1)]],
   });
   departamentos: String[] = [];
   provincia: String[] = [];
   distrito: Ubigeo[] = [];
   lisLider: Usuario[] = [];
   obUsuario!: Usuario;
   constructor(private GrupoService: GrupoService,
      private utilService: UtilService,
      private tokenService: TokenService,
      private formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: Grupo) {
      this.grupo = data;
      console.log("EsConstructor");
   }
   ngOnInit() {
      console.log("OnInit [Inicio]");
      this.utilService.listarDepartamento().subscribe(x => this.departamentos = x);
      if (this.grupo.ubigeo?.departamento !== "-1") {
         this.utilService.listaProvincias(this.grupo.ubigeo?.departamento).subscribe(
            x => this.provincia = x);
      }
      if (this.grupo.ubigeo?.departamento !== "-1" && this.grupo.ubigeo?.provincia !== "-1") {
         this.utilService.listaDistritos(this.grupo.ubigeo?.departamento, this.grupo.ubigeo?.provincia).subscribe(
            x => this.distrito = x
         );
      }
      this.utilService.listaJefePrestamistaTotales().subscribe(
         x => this.lisLider = x);
      this.obUsuario.idUsuario = this.tokenService.getUserId();
      console.log("Usuario ", this.obUsuario)
      console.log("ID DE LA SESION " + this.tokenService.getUserId())
      // console.log(this.tokenService.getUserId());
   }
   actualiza() {

      this.GrupoService.actualizarGrupo(this.grupo).subscribe(
         x => {
            Swal.fire({ icon: 'info', title: 'Excelente Actualizacion', text: x.mensaje, });
            this.grupo = {
               descripcion: "",
               ubigeo: {
                  idUbigeo: -1,
                  departamento: "-1",
                  provincia: "-1",
                  distrito: "",
               },
               usuarioLider: {
                  idUsuario: -1
               },
               usuarioRegistro: {
                  idUsuario: -1
               },
               usuarioActualiza: {
                  idUsuario: -1
               },
            }
            console.log("registra [fin]" + this.grupo)
         },
         error => {
            console.error('Error al actualizar:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error cuando actualizas el grupo. llenar todos los datos' });
         }
      );
   }
   validaDescripcion(control: FormControl) {
      console.log("validaDescripcion [inicio] " + control.value);
      return this.GrupoService.validarNombreActualiza(control.value, this.grupo.idGrupo || 0).pipe(
         map((resp: any) => {
            console.log("validaDescripcion [resp] " + resp.valid);
            return (resp.valid) ? null : { existeDescripcion: true };
         })
      );
   }
   lisProvincia() {
      console.log("listaProvincia " + this.grupo.ubigeo?.departamento);

      this.grupo.ubigeo!.provincia = "-1";
      this.grupo.ubigeo!.idUbigeo = -1;
      this.provincia = [];
      this.distrito = [];

      if (this.grupo.ubigeo?.departamento !== "-1") {
         this.utilService.listaProvincias(this.grupo.ubigeo?.departamento).subscribe(
            x => this.provincia = x
         );
      }
   }


   lisDistrito() {
      console.log("listaDistrito>>> " + this.grupo.ubigeo?.departamento);
      console.log("listaDistrito>>> " + this.grupo.ubigeo?.provincia);

      this.grupo.ubigeo!.idUbigeo = -1;
      this.distrito = [];

      if (this.grupo.ubigeo?.departamento !== "-1" && this.grupo.ubigeo?.provincia !== "-1") {
         this.utilService.listaDistritos(this.grupo.ubigeo?.departamento, this.grupo.ubigeo?.provincia).subscribe(
            x => this.distrito = x
         );
      }
   }

   seleccionaLider(idUsuarioSeleccionado: number) {
      this.grupo.usuarioLider = this.grupo.usuarioLider || {};
      this.grupo.usuarioLider.idUsuario = idUsuarioSeleccionado;
   }
   salida() {
   }

}