import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { Revista } from '../../models/revista.model';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { RevistaService } from '../../services/revisa.service';

import Swal from 'sweetalert2'
import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  selector: 'app-agregar-revista',
  templateUrl: './agregar-revista.component.html',
  styleUrls: ['./agregar-revista.component.css']
})
export class AgregarRevistaComponent {

      lstPais: Pais[] = [];
      lstTipo: DataCatalogo[] = [];

      objRevista: Revista ={
            nombre: "",
            frecuencia: "",
            fechaCreacion : undefined,
            telefono: "",
            pais:{
              idPais:-1
            },
            tipoRevista:{
                idDataCatalogo:-1
            }
        }
        objUsuario: Usuario = {} ;

      formsRegistra = this.formBuilder.group({ 
        validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
        validaFrecuencia: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] , 
        validafecha: ['', [Validators.required] ] , 
        validatelefono: ['', [Validators.required, Validators.pattern('[0-9]{9}')] ] , 
        validaPais: ['', Validators.min(1)] , 
        validaTipoRevista: ['', Validators.min(1)] , 
      });

      constructor(private utilService: UtilService, 
                  private tokenService: TokenService,
                  private revistaService: RevistaService,
                  private formBuilder: FormBuilder){
              this.utilService.listaTipoLibroRevista().subscribe(
                    x =>  this.lstTipo = x
              );
              this.utilService.listaPais().subscribe(
                x =>  this.lstPais = x
              );
              this.objUsuario.idUsuario = tokenService.getUserId();
      }
      registra(){
        if (this.formsRegistra.valid){

            this.objRevista.usuarioActualiza = this.objUsuario;
            this.objRevista.usuarioRegistro = this.objUsuario;
            this.revistaService.registrar(this.objRevista).subscribe(
              x=>{
                Swal.fire({
                  icon: 'info',
                  title: 'Resultado del Registro',
                  text: x.mensaje,
                });
               
                this.objRevista ={
                    nombre: "",
                    frecuencia: "",
                    fechaCreacion : undefined,
                    telefono: "",
                    pais:{
                      idPais:-1
                    },
                    tipoRevista:{
                        idDataCatalogo:-1
                    }
                }
              },
            );

          }
      }
}
