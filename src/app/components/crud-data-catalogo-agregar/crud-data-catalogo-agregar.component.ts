import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
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
import { booleanValidator } from '../../services/Validator.service';

@Component({
  selector: 'app-crud-data-catalogo-agregar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-data-catalogo-agregar.component.html',
  styleUrl: './crud-data-catalogo-agregar.component.css'
})
export class CrudDataCatalogoAgregarComponent {
  @ViewChild('estado') estado!: ElementRef;

  dataCatalogo : DataCatalogo ={
    descripcion: "",
    estado: -1,
    catalogo:{
      idCatalogo:-1
    },
    usuarioPrestatario:{
      idUsuario: -1
    },
    usuarioRegistro:{
      idUsuario:-1
    },
  }
  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')], this.validaDescripcion.bind(this)],
    validaTipoCatalogo: ['', [Validators.min(1)]],
  });
  lstCatalogo: Catalogo[] = [];
  objUsuario: Usuario = {};
  constructor(private DataCatalogoService: DataCatalogoService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) {
      console.log(">>> constructor  >>> ");
    }
    ngOnInit() {
      console.log(">>> OnInit [inicio]");
      this.utilService.listaDescripcion().subscribe(
          x=> this.lstCatalogo = x
      );
      this.objUsuario.idUsuario = this.tokenService.getUserId();
      console.log(">>> OnInit >>> " + this.lstCatalogo);
      console.log(">>> OnInit [fin]");
    }
    registra() {
      console.log(">>> registra [inicio]");
      this.dataCatalogo.usuarioRegistro = this.objUsuario;
      console.log(">>> registra [inicio] " + this.dataCatalogo);
      console.log (this.estado.nativeElement.checked);
      if(this.estado.nativeElement.checked == true){
        this.dataCatalogo.estado = 1
      }else{
      this.dataCatalogo.estado = 0
      }
  
      this.DataCatalogoService.registrarCrud(this.dataCatalogo).subscribe(
        x=>{
            Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
              this.dataCatalogo ={
                      descripcion: "",
                      estado:-1,
                      catalogo:{
                        idCatalogo:-1
                      },
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
  
       return this.DataCatalogoService.validarNombreRegistro(control.value).pipe(
         map((resp: any) => {
              console.log(">>> validaDescripcion [resp] " + resp.valid);
              return (resp.valid) ? null : {existeDescripcion: true} ;
            })
        );
    }
    salir(){
    }
}
