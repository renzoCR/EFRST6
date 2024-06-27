import { Component, Inject, inject } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { UtilService } from '../../services/util.service';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-crud-solicitud-prestamo-actualizar',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './crud-solicitud-prestamo-actualizar.component.html',
  styleUrl: './crud-solicitud-prestamo-actualizar.component.css',
})
export class CrudSolicitudPrestamoActualizarComponent {
  private solicitudPrestamoService = inject(SolicitudPrestamoService);
  private montoPrestamoService = inject(MontoPrestamoService);
  private UtilServicee = inject(UtilService);
  private tokenService = inject(TokenService);
  private snackBar = inject(MatSnackBar);
  solicitud: SolicitudPrestamo = {
    idSolicitud: 0,
    dias: {
      idDataCatalogo: -1,
    },
    capital: 0,
    montoPagar: 0,
    fechaInicioPrestamo: '',
    usuarioPrestatario: {
      idUsuario: -1,
    },
  };

  formRegistrar = this.formBuilder.group({
    idSolicitud: [0],
    dias: [{} as DataCatalogo, [Validators.required, Validators.min(1)]],
    capital: [{} as any, [Validators.min(1)]],
    montoPagar: [{} as any, [Validators.min(1)]],
    fechaInicioPrestamo: ['', [Validators.min(1)]],
    usuarioPrestatario: [{} as Usuario, [Validators.min(1)]],
  });

  diasList: DataCatalogo[] = [];
  capitalList: MontoPrestamo[] = [];
  prestarioList: Usuario[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: SolicitudPrestamo
  ) {
    this.formRegistrar.controls['montoPagar'].disable();
    //Pasar el objeto a la variable
    this.solicitud = data;
    this.formRegistrar.controls['idSolicitud'].setValue(data.idSolicitud!);
    this.formRegistrar.controls['dias'].setValue(data.dias!);
    this.formRegistrar.controls['capital'].setValue(data.capital!);
    this.formRegistrar.controls['montoPagar'].setValue(data.montoPagar!);
    this.formRegistrar.controls['fechaInicioPrestamo'].setValue(
      data.fechaActualizacion!
    );
    this.formRegistrar.controls['usuarioPrestatario'].setValue(
      data.usuarioPrestatario!
    );

    const idActual = this.tokenService.getUserId();
    this.UtilServicee.listaPrestamistariosDeUnPrestamista(idActual).subscribe(
      (data) => {
        this.prestarioList = data;
      }
    );
    this.UtilServicee.listaDiasPrestamo().subscribe((data) => {
      this.diasList = data;
    });
  }
  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onDiaSelected($event: MatSelectChange) {
    const { value } = $event;
    this.montoPrestamoService
      .montoPrestamoListaPorDias(value.idDataCatalogo)
      .subscribe((data) => {
        this.capitalList = data;
      });
  }
  onCapitalSelected($event: MatSelectChange) {
    const { value } = $event;
    this.formRegistrar.controls['montoPagar'].setValue(value.monto);
  }

  register() {
    if (!this.formRegistrar.valid) {
      this.formRegistrar.markAllAsTouched();
      return;
    }

    this.formRegistrar.controls['montoPagar'].enable();
    if (this.formRegistrar.controls['capital']!.value!.capital) {
      this.formRegistrar.controls['capital'].setValue(
        this.formRegistrar.controls['capital']!.value!.capital
      );
    }

    console.log(this.formRegistrar.value);
    this.solicitudPrestamoService
      .registrar(this.formRegistrar.value as unknown as SolicitudPrestamo)
      .subscribe({
        next: ({ mensaje }) => {
          this.showNotification(mensaje, 'Aceptar');
          this.formRegistrar.reset();
          this.formRegistrar.controls['montoPagar'].disable();
          this.solicitud = {
            idSolicitud: 0,
            dias: {
              idDataCatalogo: -1,
            },
            capital: 0,
            montoPagar: 0,
            fechaInicioPrestamo: '',
            usuarioPrestatario: {
              idUsuario: -1,
            },
          };
        },
        error: ({ mensaje }) => {
          if (mensaje) {
            this.showNotification(mensaje, 'Cerrar');
            return;
          }
          this.showNotification('Error al registrar', 'Cerrar');
        },
      });
  }
}
