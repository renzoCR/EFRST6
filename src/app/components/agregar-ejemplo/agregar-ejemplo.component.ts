import { Component } from '@angular/core';

import Swal from 'sweetalert2'

import { Ejemplo } from '../../models/ejemplo.model';
import { Pais } from '../../models/pais.model';
import { Usuario } from '../../models/usuario.model';
import { EjemploService } from '../../services/ejemplo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-agregar-ejemplo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-ejemplo.component.html',
  styleUrls: ['./agregar-ejemplo.component.css']
})
export class AgregarEjemploComponent {

  lstPais: Pais[] = [];
  ejemplo: Ejemplo ={
      descripcion: "",
      pais:{
        idPais:-1
      }
  }
  objUsuario: Usuario = {} ;

  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')],
                            this.validaDescripcion.bind(this)],
    validaPais: ['', [Validators.min(1)]]
  });



  constructor(private ejemploService: EjemploService,
              private utilService: UtilService,
              private tokenService: TokenService,
              private formBuilder: FormBuilder) 
  {
        utilService.listaPais().subscribe(
          x   =>   this.lstPais=x
        )
        this.objUsuario.idUsuario = tokenService.getUserId();
  }

  registra(){
        this.ejemplo.usuarioActualiza = this.objUsuario;
        this.ejemplo.usuarioRegistro = this.objUsuario;
        this.ejemploService.registrar(this.ejemplo).subscribe(
          x=>{
                Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
                this.ejemplo = {
                  descripcion: "",
                  pais: {
                    idPais: -1
                  }
            };
          },
        );
   }

  validaDescripcion(control: FormControl) {
    console.log(">>> validaDescripcion [inicio] " + control.value);
    
     return this.ejemploService.validaDescripcionRegistra(control.value).pipe(
       map((resp: any) => { 
            console.log(">>> validaDescripcion [resp] " + resp.valid);
            return (resp.valid) ? null : {existeDescripcion: true} ;    
          })
      );
   }

}
