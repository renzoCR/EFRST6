import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-crud-solicitud-prestamo-agregar',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './crud-solicitud-prestamo-agregar.component.html',
  styleUrl: './crud-solicitud-prestamo-agregar.component.css',
})
export class CrudSolicitudPrestamoAgregarComponent {
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
    dias: [{} as DataCatalogo, [Validators.required]],
    capital: [{} as any, [Validators.required]],
    montoPagar: [{} as any, [Validators.required]],
    fechaInicioPrestamo: ['', [Validators.required]],
    usuarioPrestatario: [{} as Usuario, [Validators.required]],
  });

  diasList: DataCatalogo[] = [];
  capitalList: MontoPrestamo[] = [];
  prestarioList: Usuario[] = [];

  constructor(private formBuilder: FormBuilder) {
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
