import { Component, Inject } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-cuenta-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-cuenta-actualizar.component.html',
  styleUrl: './crud-cuenta-actualizar.component.css'
})
export class CrudCuentaActualizarComponent {
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
              private cuentaService: CuentaService,
              @Inject(MAT_DIALOG_DATA) public data: Cuenta
            ) {
              this.cuenta = data;
        console.log(">>> constructor  >>> ");
            }

  ngOnInit() {
    this.utilService.listaTipoEntidadBancaria().subscribe(
      tipos => this.lstTipoEntidad = tipos
    );
    this.utilService.listaTipoMoneda().subscribe(
      tipos => this.lstMoneda = tipos
    )
      this.utilService.listaEntidadesFinancierasPorTipo(this.cuenta.entidadFinanciera && this.cuenta.entidadFinanciera.tipoEntidad && this.cuenta.entidadFinanciera.tipoEntidad.idDataCatalogo !== undefined
        ? this.cuenta.entidadFinanciera.tipoEntidad.idDataCatalogo
        : -1).subscribe(
        tipos => this.lstEntidadesFinancieras = tipos
      );


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

  actualiza() {
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
    console.log(">>> validaNumero [inicio] " + control.value);
    return this.cuentaService.validaNumeroActualiza(control.value, this.cuenta.idCuenta || 0).pipe(
       map((resp: any) => {
            console.log(">>> validaDescripcion [resp] " + resp.valid);
            return (resp.valid) ? null : {existeNumero: true} ;
          })
      );
  }
}
