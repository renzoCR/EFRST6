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
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { ValidatorService } from '../../services/Validator.service';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { CrudSolicitudPrestamoActualizarComponent } from '../crud-solicitud-prestamo-actualizar/crud-solicitud-prestamo-actualizar.component';
import { CrudSolicitudPrestamoAgregarComponent } from '../crud-solicitud-prestamo-agregar/crud-solicitud-prestamo-agregar.component';
import { MatSelectChange } from '@angular/material/select';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-consulta-solicitud-prestamo',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './consulta-solicitud-prestamo.component.html',
  styleUrl: './consulta-solicitud-prestamo.component.css',
})
export class ConsultaSolicitudPrestamoComponent {
  private solicitudPrestamoService = inject(SolicitudPrestamoService);
  private validatorsService = inject(ValidatorService);
  private dialogService = inject(MatDialog);
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);
  private montoPrestamoService = inject(MontoPrestamoService);
  private UtilServicee = inject(UtilService);
  private snackBar = inject(MatSnackBar);
  dataSource: any;
  solicitudSeleccionada: SolicitudPrestamo | undefined;
  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  diasList: DataCatalogo[] = [];
  capitalList: MontoPrestamo[] = [];
  prestarioList: Usuario[] = [];
  //Cabecera
  displayedColumns = [
    'idSolicitud',
    'capital',
    'montoPagar',
    'dias',
    'fechaInicioPrestamo',
    'fechaFinPrestamo',
    'estado',
  ];

  public myForm: FormGroup = this.fb.group({
    dias: ['', [Validators.required]],
    capital: [],
    montoPagar: [],
    fechaInicioPrestamo: [],
    fechaFinPrestamo: [],
    usuarioPrestatario: [],
    estado: [true],
  });

  ngOnInit(): void {
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
  onDiaSelected(event: MatSelectChange) {
    const { value } = event;
    this.montoPrestamoService
      .montoPrestamoListaPorDias(value.idDataCatalogo)
      .subscribe((data) => {
        this.capitalList = data;
      });
  }
  onCapitalSelected($event: MatSelectChange) {
    const { value } = $event;
    this.myForm.get('montoPagar')?.setValue(value.monto);
  }
  exportarPDF() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let soli = this.myForm.value;
    this.solicitudPrestamoService
      .generateDocumentReport(soli)
      .subscribe((response) => {
        console.log(response);
        var url = window.URL.createObjectURL(response.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = response.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
  filter() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let soli = this.myForm.value;
    this.solicitudPrestamoService.buscarComplejo(soli).subscribe({
      next: (resp) => {
        if (resp.length === 0) {
          this.showNotification('No se encontraron resultados ', 'Cerrar');
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
}
