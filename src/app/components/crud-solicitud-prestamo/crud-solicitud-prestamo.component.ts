import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { ValidatorService } from '../../services/Validator.service';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { UtilService } from '../../services/util.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CrudPrestatarioActualizarComponent } from '../crud-prestatario-actualizar/crud-prestatario-actualizar.component';
import Swal from 'sweetalert2';
import { CrudPrestatarioAgregarComponent } from '../crud-prestatario-agregar/crud-prestatario-agregar.component';
import { CrudSolicitudPrestamoAgregarComponent } from '../crud-solicitud-prestamo-agregar/crud-solicitud-prestamo-agregar.component';
import { CrudSolicitudPrestamoActualizarComponent } from '../crud-solicitud-prestamo-actualizar/crud-solicitud-prestamo-actualizar.component';

@Component({
  selector: 'app-crud-solicitud-prestamo',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-solicitud-prestamo.component.html',
  styleUrl: './crud-solicitud-prestamo.component.css',
})
export class CrudSolicitudPrestamoComponent {
  private solicitudPrestamoService = inject(SolicitudPrestamoService);
  private validatorsService = inject(ValidatorService);
  private dialogService = inject(MatDialog);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  dataSource: any;
  solicitudSeleccionada: SolicitudPrestamo | undefined;
  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = [
    'idSolicitud',
    'capital',
    'montoPagar',
    'dias',
    'fechaInicioPrestamo',
    'fechaFinPrestamo',
    'estado',
    'acciones',
  ];

  public myForm: FormGroup = this.fb.group({
    montoPagar: [null, [Validators.required]],
  });

  ngOnInit(): void {}
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }
  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  search() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let soli = this.myForm.controls['montoPagar'].value;
    this.solicitudPrestamoService
      .buscarPorMonto(soli as unknown as string)
      .subscribe({
        next: (resp) => {
          if (resp.length === 0) {
            this.showNotification(
              'No se encontraron resultados que contengan: ' + soli,
              'Cerrar'
            );
            return;
          }
          this.dataSource = resp;
        },
        error: ({ mensaje }) => {
          if (mensaje) {
            this.showNotification(mensaje, 'Cerrar');
            return;
          }
          this.showNotification('Error al listar', 'Cerrar');
        },
      });
  }
  updateEstado(soli: SolicitudPrestamo, i: any) {
    this.solicitudPrestamoService.cambiarEstado(soli).subscribe({
      next: ({ mensaje }) => {
        this.showNotification(mensaje, 'Cerrar');
        this.dataSource[i].estado = soli.estado! == 1 ? 0 : 1;
      },
      error: ({ mensaje }) => {
        if (mensaje) {
          this.showNotification(mensaje, 'Cerrar');
          return;
        }
        this.showNotification('Error al cambiar estado', 'Cerrar');
      },
    });
  }
  openDialogActualizar(soli: SolicitudPrestamo) {
    const dialogRef = this.dialogService.open(
      CrudSolicitudPrestamoActualizarComponent,
      { data: soli }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && (result === 1 || result === 2)) {
        this.search();
      }
    });
  }
  openDialogRegistrar() {
    const dialogRef = this.dialogService.open(CrudSolicitudPrestamoAgregarComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && (result === 1 || result === 2)) {
        this.search();
      }
    });
  }
  delete(obj: SolicitudPrestamo) {
    Swal.fire({
      title: '¿Desea eliminar?',
      text: 'Los cambios no se van a revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimina',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudPrestamoService.eliminarCrud(obj.idSolicitud!).subscribe({
          next: ({ mensaje }) => {
            this.search();
            Swal.fire('Mensaje', mensaje, 'info');
          },
          error: ({ mensaje }) => {
            if (mensaje) {
              this.showNotification(mensaje, 'Cerrar');
              return;
            }
            this.showNotification('Error al eliminar', 'Cerrar');
          },
        });
      }
    });
  }
}
