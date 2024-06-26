import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';
import { booleanValidator } from '../../services/Validator.service';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { Catalogo } from '../../models/catalogo.model';


@Component({
  selector: 'app-agregar-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-data-catalogo.component.html',
  styleUrl: './agregar-data-catalogo.component.css'
})
export class AgregarDataCatalogoComponent {
  dataCatalogo: DataCatalogo={
    descripcion: "",
    estado: -1,
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioPrestatario: {
      idUsuario: -1
    }
  }

  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')], this.validaDescripcion.bind(this)],
    validaEstado: ['', [booleanValidator()]],
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
  this.utilService.listaCatalogo().subscribe(
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
    console.log(this.dataCatalogo);


    this.DataCatalogoService.registro(this.dataCatalogo).subscribe(
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

     return this.DataCatalogoService.validarNombreRegistro(control.value).pipe(
       map((resp: any) => {
            console.log(">>> validaDescripcion [resp] " + resp.valid);
            return (resp.valid) ? null : {existeDescripcion: true} ;
          })
      );
  }
}
