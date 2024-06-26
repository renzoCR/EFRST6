

import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { Observable, map, of } from 'rxjs';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-entidad-financiera-actualizar',
  standalone: true,
  imports: [AppMaterialModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-entidad-financiera-actualizar.component.html',
  styleUrls: ['./crud-entidad-financiera-actualizar.component.css']
})
export class CrudEntidadFinancieraActualizarComponent {

  entidadFinanciera: EntidadFinanciera = {
    nombre: "",
    gerente: "",
    tipoEntidad: {
      idDataCatalogo: -1
    },
    ubigeo: {
      idUbigeo: -1,
      departamento: "-1",
      provincia: "-1",
      distrito: "-1",
    },
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioActualiza: {
      idUsuario: -1
    },
  };

  formRegistrar = this.formBuilder.group({
    nombre: new FormControl(this.entidadFinanciera.nombre, [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,30}')], this.validaNombre.bind(this)),
    //validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,30}')], this.validaNombre.bind(this)],
    validaGerente: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaLider: ['', [Validators.min(1)]],
    validaTipoEntidad: ['', [Validators.required]]
  });

  lstTipo: DataCatalogo[] = [];
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: Ubigeo[] = [];
  objUsuario: Usuario = {};
  nombreOriginal: string = "";

  constructor(private entidadService: EntidadFinancieraService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EntidadFinanciera) {
/*constructor(private entidadService: EntidadFinancieraService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EntidadFinanciera) {
    
    //Pasar el objeto a la variable
    this.entidadFinanciera = data;

console.log(">>> constructor  >>> ");
}*/

// Pasar el objeto a la variable
this.entidadFinanciera = data;
this.nombreOriginal = this.entidadFinanciera.nombre || ''; // Guardar el nombre original, o una cadena vacía si es undefined

console.log(">>> constructor  >>> ");
}


  ngOnInit() {
    console.log(">>> OnInit [inicio]");

    // Cargar departamentos, provincias, distritos, y tipos de entidad bancaria
    this.utilService.listarDepartamento().subscribe(
      x => this.departamentos = x
    );

    this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
      x => this.provincias = x
    );

    this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento, this.entidadFinanciera.ubigeo?.provincia).subscribe(
      x => this.distritos = x
    );

    this.utilService.listaTipoEntidadBancaria().subscribe(
      x => this.lstTipo = x
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(">>> OnInit >>> 1 >> " + this.lstTipo.length);
    console.log(">>> OnInit >>> " + this.departamentos);
    console.log(">>> OnInit [fin]");
  }

  /*ngOnInit() {
  console.log(">>> OnInit [inicio]");
  
  this.utilService.listarDepartamento().subscribe(
        x => this.departamentos = x
  );
  //Cargar las provincias y distritos [inicio]
  this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
      x => this.provincias = x
  );
    this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento,this.entidadFinanciera.ubigeo?.provincia).subscribe(
      x => this.distritos = x
  );

  //Cargar las listaCataloo [fin]
  this.utilService.listaTipoEntidadBancaria().subscribe(
    x => this.lstTipo = x
  );

  this.objUsuario.idUsuario = this.tokenService.getUserId();
  console.log(">>> OnInit >>> 1 >> " + this.lstTipo.length);
  console.log(">>> OnInit >>> " + this.departamentos);
  console.log(">>> OnInit [fin]"); 
}*/

  actualiza() {
    console.log(">>> actualiza [inicio]");
    this.entidadFinanciera.usuarioActualiza = this.objUsuario;
    this.entidadFinanciera.usuarioRegistro = this.objUsuario;
    console.log(">>> actualiza [inicio] ", this.entidadFinanciera);

    this.entidadService.actualizarCrud(this.entidadFinanciera).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje });
        this.entidadFinanciera = {
          nombre: "",
          gerente: "",
          tipoEntidad: { idDataCatalogo: -1 },
          ubigeo: { idUbigeo: -1, departamento: "-1", provincia: "-1", distrito: "-1" },
          usuarioRegistro: { idUsuario: -1 },
          usuarioActualiza: { idUsuario: -1 }
        };
      }
    );
  }

  validaNombre(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log(">>> validaNombre [inicio] " + control.value);

    if (control.value === this.nombreOriginal) {
      // Si el nombre no ha cambiado, no realizar la validación
      return of(null);
    }

    return this.entidadService.validarNombreRegistro(control.value).pipe(
      map((resp: any) => {
        console.log(">>> validaNombre [resp] " + resp.valid);
        return resp.valid ? null : { existeNombre: true };
      })
    );
  }

  /*validaNombre(control: FormControl) {
    console.log(">>> validaNombre [inicio] " + control.value);
  
     return this.entidadService.validarNombreRegistro(control.value).pipe(
       map((resp: any) => { 
            console.log(">>> validaNombre [resp] " + resp.valid);
            return (resp.valid) ? null : {existeNombre: true} ;
          })
      );
  }*/

  cargarDatosCatalogosPorTipo() {
    this.utilService.listaTipoEntidadBancaria().subscribe(
      catalogo => this.lstTipo = catalogo
    );
  }

  onTipoEntidadChange(event: any) {
    const tipoCatalogoId = event.value;
    this.cargarDatosCatalogosPorTipo();
  }

  listaProvincia() {
    console.log("listaProvincia>>> " + this.entidadFinanciera.ubigeo?.departamento);
    this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
      x => this.provincias = x
    );
  }

  listaDistrito() {
    console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.departamento);
    console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.provincia);
    this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento, this.entidadFinanciera.ubigeo?.provincia).subscribe(
      x => this.distritos = x
    );
  }

  salir() {
  }

}
