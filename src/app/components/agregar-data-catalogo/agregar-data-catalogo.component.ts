import { Component, ElementRef, OnInit , ViewChild} from '@angular/core';
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
import { Catalogo } from '../../models/catalogo.model';


@Component({
  selector: 'app-agregar-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-data-catalogo.component.html',
  styleUrl: './agregar-data-catalogo.component.css'
})
export class AgregarDataCatalogoComponent {
  @ViewChild('estado') estado!: ElementRef;
  
  dataCatalogo: DataCatalogo={
    descripcion: "",
    estado: -1,
    catalogo:{
      idCatalogo:-1
    },
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioPrestatario: {
      idUsuario: -1
    },
  }

  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,45}')], this.validaDescripcion.bind(this)],
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
    console.log(this.dataCatalogo);
    console.log(this.dataCatalogo.catalogo);
    console.log (this.estado.nativeElement.checked);
    if(this.estado.nativeElement.checked == true){
      this.dataCatalogo.estado = 1
    }else{
      this.dataCatalogo.estado = 0
    }

    this.DataCatalogoService.registro(this.dataCatalogo).subscribe(
      x=>{
          Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
            this.dataCatalogo ={
                    descripcion: "",
                    estado:-1,
                    catalogo:{
                      idCatalogo: -1
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
}
