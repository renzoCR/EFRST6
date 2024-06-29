import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Coordenada } from '../../models/coordenada.model';
import { CoordenadaService } from '../../services/coordenada.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-coordenada-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-coordenada-actualizar.component.html',
  styleUrl: './crud-coordenada-actualizar.component.css'
})
export class CrudCoordenadaActualizarComponent {

  coordenada: Coordenada = {
    prestatario: {
      idUsuario: -1
    },
    latitud: null,
    longitud: null,
    ubigeo: {
      idUbigeo: -1,
      departamento: "-1",
      provincia: "-1",
      distrito: "",
    },
     estado:1,
    usuarioActualiza: {
      idUsuario: -1
    },
    usuarioRegistro: {
      idUsuario: -1
    },
   
  }


  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: Ubigeo[] = [];

  lstPrestatarios: Usuario[] = [];

  objUsuario: Usuario = {};


  formRegistrar = this.formBuilder.group({
    validaLatitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaLongitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaPrestatario: ['', [Validators.min(1)]],
  });


  constructor(
    private formBuilder: FormBuilder,
    private coordenadaService: CoordenadaService,
    private utilService: UtilService,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: Coordenada
  ) {
     //Pasar el objeto a la variable
     this.coordenada = data;
     console.log(">>> constructor  >>> ");

   }

  
  ngOnInit() {
    console.log(">>> OnInit [inicio]");

    this.utilService.listarDepartamento().subscribe(
      x => this.departamentos = x
    );


   //Cargar las provincias y distritos [inicio]
    this.utilService.listaProvincias(this.coordenada.ubigeo?.departamento).subscribe(
      x => this.provincias = x
  );
    this.utilService.listaDistritos(this.coordenada.ubigeo?.departamento,this.coordenada.ubigeo?.provincia).subscribe(
      x => this.distritos = x
  );

  //Cargar las provincias y distritos [fin]
  
    this.coordenadaService.listaPrestamistariosTotales().subscribe(
      x => this.lstPrestatarios = x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(">>> OnInit >>> " + this.departamentos);
        console.log(">>> OnInit >>> " + this.lstPrestatarios);
        console.log(">>> OnInit [fin]"); 
  }
  

actualizar() {
     console.log(">>> actualiza [inicio]");
    this.coordenada.usuarioActualiza = this.objUsuario;
    this.coordenada.usuarioRegistro = this.objUsuario;
    console.log(">>> actualiza [inicio] ", this.coordenada);
    console.log(this.coordenada)

    this.coordenadaService.registrar(this.coordenada,this.objUsuario.idUsuario!).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Resultado de coordenada registrada', text: x.mensaje });
        this.coordenada = {
          prestatario: {
            idUsuario: -1
          },
          latitud: null,
          longitud: null,
          ubigeo: {
            idUbigeo: -1,
            departamento: "-1",
            provincia: "-1",
            distrito: ""
          },
          estado: 1,
          usuarioActualiza: {
            idUsuario: -1
          },
          usuarioRegistro: {
            idUsuario: -1
          },
          
        }
         
      }

    );
  }


  listaProvincia() {
    console.log("listaProvincia>>> " + this.coordenada.ubigeo?.departamento);
    this.utilService.listaProvincias(this.coordenada.ubigeo?.departamento).subscribe(
      x => this.provincias = x
    );
  }

  listaDistrito() {
    console.log("listaDistrito>>> " + this.coordenada.ubigeo?.departamento);
    console.log("listaDistrito>>> " + this.coordenada.ubigeo?.provincia);
    this.utilService.listaDistritos(this.coordenada.ubigeo?.departamento, this.coordenada.ubigeo?.provincia).subscribe(
      x => this.distritos = x
    );
  }

salir(){}


}
