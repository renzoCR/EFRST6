import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { map } from 'rxjs';
import { DataCatalogo } from '../../models/dataCatalogo.model';


@Component({
  selector: 'app-agregar-entidad-financiera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-entidad-financiera.component.html',
  styleUrl: './agregar-entidad-financiera.component.css'
})
export class AgregarEntidadFinancieraComponent {
  entidadFinanciera: EntidadFinanciera={
    nombre: "",
    gerente: "",
    tipoEntidad:{
      idDataCatalogo:-1
    },
    ubigeo:{
        idUbigeo:-1,
        departamento:"-1",
        provincia:"-1",
        distrito:"-1",
    },
    usuarioRegistro: {
        idUsuario: -1
    },
    usuarioActualiza: {
        idUsuario: -1
    },
  }

  formRegistrar = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,30}')], this.validaNombre.bind(this)],
    validaGerente: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaLider: ['', [Validators.min(1)]],
    validaTipoEntidad: ['', [Validators.required]]
});


  lstTipo : DataCatalogo[] = [];
  departamentos : string[] = [];
  provincias : string[] = [];
  distritos: Ubigeo[] = [];
  objUsuario: Usuario = {};
  constructor(private EntidadFinancieraService: EntidadFinancieraService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) {
  console.log(">>> constructor  >>> ");
  }

  ngOnInit() {
    console.log(">>> OnInit [inicio]");

    this.utilService.listaTipoEntidadBancaria().subscribe(
      x => this.lstTipo = x
    );
    this.utilService.listarDepartamento().subscribe(
        x => this.departamentos = x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
        console.log(">>> OnInit >>> 1 >> " + this.lstTipo.length);
        console.log(">>> OnInit >>> " + this.departamentos);
        console.log(">>> OnInit [fin]");
      }

  
    registro() {
      console.log(">>> registra [inicio]");
      this.entidadFinanciera.usuarioActualiza = this.objUsuario;
      this.entidadFinanciera.usuarioRegistro = this.objUsuario;
      console.log(">>> registra [inicio] " + this.entidadFinanciera);
      console.log(this.entidadFinanciera);

      this.EntidadFinancieraService.registro(this.entidadFinanciera).subscribe(
        x => {
          Swal.fire({
            icon: 'info',
            title: 'Resultado del Registro',
            text: x.mensaje,


          });
          this.formRegistrar.reset();
          this.formRegistrar.markAsPristine();
        },
      );
  }
          

  validaNombre(control: FormControl) {
    console.log(">>> validaNombre [inicio] " + control.value);
  
     return this.EntidadFinancieraService.validarNombreRegistro(control.value).pipe(
       map((resp: any) => { 
            console.log(">>> validaNombre [resp] " + resp.valid);
            return (resp.valid) ? null : {existeNombre: true} ;
          })
      );
  }


  listaProvincia(){
          console.log("listaProvincia>>> " + this.entidadFinanciera.ubigeo?.departamento);
          this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
              x => this.provincias = x
          );
  }
  listaDistrito(){
  
    console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.departamento);
    console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.provincia);
    this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento,this.entidadFinanciera.ubigeo?.provincia).subscribe(
        x => this.distritos = x
    );
  }
}
