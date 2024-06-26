import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Grupo } from '../../models/grupo.model';
import { GrupoService } from '../../services/grupo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';

@Component({
  selector: 'crud-grupo-agregar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-grupo-agregar.component.html',
  styleUrl: './crud-grupo-agregar.component.css'
})
export class CrudGrupoAgregarComponent{
  grupo: Grupo={
    "descripcion": "",
    "ubigeo": {
    idUbigeo:-1,
    departamento:"-1",
    provincia:"-1",
    distrito:"",
    },
    "usuarioLider": {
    "idUsuario": -1
    },
    "usuarioRegistro": {
    "idUsuario": -1
    },
    "usuarioActualiza": {
    "idUsuario": -1
    },
  }
  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')], this.validaDescripcion.bind(this)],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaLider: ['', [Validators.min(1)]],
});
  departamentos : string[] = [];
  provincia : string[] = [];
  distrito: Ubigeo[] = [];
  lstLider: Usuario[] = [];
  obUsuario: Usuario = {};
  constructor(private GrupoService: GrupoService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) {
  console.log("constructor ");
  }
  ngOnInit() {
    console.log("OnInit [inicio]");
    this.utilService.listarDepartamento().subscribe(
        x => this.departamentos = x
    );
    this.utilService.listaJefePrestamistaTotales().subscribe(
            x => this.lstLider = x
    );
    this.obUsuario.idUsuario = this.tokenService.getUserId();
    console.log("OnInit" + this.departamentos);
    console.log("OnInit" + this.lstLider);
    console.log("OnInit [fin]");      
    }

    registro() {
      console.log("registra [inicio]");
      this.grupo.usuarioActualiza = this.obUsuario;
      this.grupo.usuarioRegistro = this.obUsuario;
      console.log("registra [inicio] " + this.grupo);
      console.log(this.grupo);

    this.GrupoService.registro(this.grupo).subscribe(
        x=>{
              Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
              this.grupo ={
                      descripcion: "",
                      ubigeo:{
                          idUbigeo:-1,
                          departamento:"-1",
                          provincia:"-1",
                          distrito:"",
                      },
                      usuarioLider: {
                          idUsuario: -1},
                      usuarioRegistro: {
                          idUsuario: -1},
                      usuarioActualiza: {
                          idUsuario: -1},  
}},
  error => {
  console.error('Error al registrar:', error);
  Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar el grupo' });
        }
      );
  }
  validaDescripcion(control: FormControl) {
  console.log("validaDescripcion [inicio] " + control.value);
  
    return this.GrupoService.validarNombreRegistro(control.value).pipe(
      map((resp: any) => { 
          console.log("validaDescripcion [resp] " + resp.valid);
          return (resp.valid) ? null : {existeDescripcion: true} ;    
        })
    );
}
listaProvincia(){
  console.log("listaProvincia " + this.grupo.ubigeo?.departamento);
  this.utilService.listaProvincias(this.grupo.ubigeo?.departamento).subscribe(
      x => this.provincia = x
  );
}
listaDistrito(){
  console.log("listaDistrito " + this.grupo.ubigeo?.departamento);
  console.log("listaDistrito " + this.grupo.ubigeo?.provincia);
  this.utilService.listaDistritos(this.grupo.ubigeo?.departamento,this.grupo.ubigeo?.provincia).subscribe(
      x => this.distrito = x);
}
seleccionaLider(idUsuarioSeleccionado: number) {
  this.grupo.usuarioLider = this.grupo.usuarioLider || {};
  this.grupo.usuarioLider.idUsuario = idUsuarioSeleccionado;
}


}
