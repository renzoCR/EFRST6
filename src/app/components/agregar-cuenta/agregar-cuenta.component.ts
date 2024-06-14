import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Router } from '@angular/router';
import { CuentaService } from '../../services/cuenta.service';
import { Cuenta } from '../../models/cuenta.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';


@Component({
  selector: 'app-agregar-cuenta',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-cuenta.component.html',
  styleUrl: './agregar-cuenta.component.css'
})
export class AgregarCuentaComponent {

  cuenta:Cuenta = {
    numero: "",
    entidadFinanciera: {
      idEntidadFinanciera: -1,
      tipoEntidad: {
        idDataCatalogo: -1,
      }
    },
    tipoMoneda: {
      idDataCatalogo: -1,
    },
    usuarioRegistro: {
      idUsuario: -1,
    },
    usuarioActualiza: {
      idUsuario: -1,
    },
    estado: 1,
      };

  lstTipoEntidad: DataCatalogo[] = [];
  lstEntidadesFinancieras: EntidadFinanciera[] = [];
  lstMoneda: DataCatalogo[] = [];

  objUsuario: Usuario = {};


  formRegistrar = this.formBuilder.group({
    validaNumero: ['', [Validators.required, Validators.pattern('^[0-9]{20}$')], this.validaNumero.bind(this)],
    validaTipoEntidad: ['', [Validators.required, Validators.min(1)]],
    validaEntidadFinanciera: ['', [Validators.required, Validators.min(1)]],
    validaMoneda:['', [Validators.required, Validators.min(1)]]
    // Otros form controls que necesites
  });

  constructor(private utilService: UtilService,
              private tokenService: TokenService,
              private formBuilder: FormBuilder,
              private cuentaService: CuentaService) { }

  ngOnInit() {
    this.utilService.listaTipoEntidadBancaria().subscribe(
      tipos => this.lstTipoEntidad = tipos
    );
    this.utilService.listaTipoMoneda().subscribe(
      tipos => this.lstMoneda = tipos
    )
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  cargarEntidadesFinancierasPorTipo(tipoEntidadId: number) {
    this.utilService.listaEntidadesFinancierasPorTipo(tipoEntidadId).subscribe(
      entidades => this.lstEntidadesFinancieras = entidades
    );
  }

  onTipoEntidadChange(event: any) {
    const tipoEntidadId = event.value;
    this.cargarEntidadesFinancierasPorTipo(tipoEntidadId);
  }

  registra() {
    console.log(">>> registra [inicio]");

        this.cuenta.usuarioActualiza = this.objUsuario;
        this.cuenta.usuarioRegistro = this.objUsuario;
        console.log(">>> registra [inicio] " + this.cuenta);
        console.log(this.cuenta);

        this.cuentaService.registrar(this.cuenta).subscribe(
          x=>{
                Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
                this.cuenta ={
                  numero: "",
                  entidadFinanciera: {
                    idEntidadFinanciera: -1,
                    tipoEntidad: {
                      idDataCatalogo: -1,
                    }
                  },
                  tipoMoneda: {
                    idDataCatalogo: -1,
                  },
                  usuarioRegistro: {
                    idUsuario: -1,
                  },
                  usuarioActualiza: {
                    idUsuario: -1,
                  },
                  estado: 1,
                    };
            }
        );
  }
  validaNumero(control: FormControl) {
    console.log(">>> validaDescripcion [inicio] " + control.value);

     return this.cuentaService.validaNumeroRegistra(control.value).pipe(
       map((resp: any) => {
            console.log(">>> validaNumero [resp] " + resp.valid);
            return (resp.valid) ? null : {existeNumero: true} ;
          })
      );
  }

}
