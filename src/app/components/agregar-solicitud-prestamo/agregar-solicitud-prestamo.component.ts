import { Component, inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { UtilService } from '../../services/util.service';
import { ValidatorService } from '../../services/Validator.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { Usuario } from '../../models/usuario.model';
import { MatSelectChange } from '@angular/material/select';
import { TokenService } from '../../security/token.service';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-agregar-solicitud-prestamo',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './agregar-solicitud-prestamo.component.html',
  styleUrl: './agregar-solicitud-prestamo.component.css',
})
export class AgregarSolicitudPrestamoComponent {
  private solicitudPrestamoService = inject(SolicitudPrestamoService);
  private montoPrestamoService = inject(MontoPrestamoService);
  private UtilServicee = inject(UtilService);
  private validatorsService = inject(ValidatorService);
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  diasList: DataCatalogo[] = [];
  capitalList: MontoPrestamo[] = [];
  prestarioList: Usuario[] = [];

  public myForm: FormGroup = this.fb.group({
    dias: ['', [Validators.required]],
    capital: [null, [Validators.required]],
    montoPagar: [null, [Validators.required]],
    fechaInicioPrestamo: [null, [Validators.required]],
    usuarioPrestatario: [null, [Validators.required]],
  });
  ngOnInit(): void {
    this.myForm.get('capital')!.disable();
    this.myForm.get('montoPagar')!.disable();
    this.myForm.get('dias')!.valueChanges.subscribe((value) => {
      if (value) {
        this.myForm.get('capital')!.enable();
      }
    });
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
  register() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      console.log(this.myForm);
      return;
    }
    let soli = new SolicitudPrestamo();
    soli = this.myForm.value;
    soli.capital = this.myForm.controls['capital'].value.capital;
    soli.montoPagar = this.myForm.controls['montoPagar'].value;
    this.solicitudPrestamoService.registrar(soli).subscribe({
      next: ({ mensaje }) => {
        this.myForm.reset();
        this.capitalList = [];
        this.myForm.get('capital')?.disable();
        this.showNotification(mensaje, 'Cerrar');
        console.log(this.myForm);
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
