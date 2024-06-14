import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';
import { DataCatalogo } from '../../models/dataCatalogo.model';

@Component({
  selector: 'app-agregar-monto-prestamo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-monto-prestamo.component.html',
  styleUrl: './agregar-monto-prestamo.component.css'
})
export class AgregarMontoPrestamoComponent {
  monto: MontoPrestamo={
    "capital": 0,
    "dias": {
        idDataCatalogo:-1,
        descripcion:"",
        usuarioPrestatario: {
          idUsuario: -1
        },
        usuarioRegistro: {
          idUsuario: -1
        },
      },
    "monto": 0,
    "usuarioRegistro": {
      idUsuario: -1
    },
    "usuarioActualiza": {
      idUsuario: -1
    },
  }
  formRegistrar = this.formBuilder.group({
    validaCapital: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    validaDias: ['', [Validators.min(1)]],
    validaMonto: ['', [Validators.required, Validators.pattern('^-?\\d*(\\.\\d+)?$')]],
});
dias : DataCatalogo[] = []
objUsuario: Usuario = {};
constructor(private MontoPrestamoService: MontoPrestamoService,
  private utilService: UtilService,
  private tokenService: TokenService,
  private formBuilder: FormBuilder) {
console.log(">>> constructor  >>> ");
}
ngOnInit() {
  console.log(">>> OnInit [inicio]");
  this.utilService.listaDiasPrestamo().subscribe(
      x => this.dias = x
  );
  this.objUsuario.idUsuario = this.tokenService.getUserId();
  console.log(">>> OnInit [fin]");      
  }

  registro() {
    console.log(">>> registra [inicio]");
    this.monto.usuarioActualiza = this.objUsuario;
    this.monto.usuarioRegistro = this.objUsuario;

    this.MontoPrestamoService.registro(this.monto).subscribe(
      x=>{
            Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
            this.monto ={
              capital: 0,
              dias: {
                  idDataCatalogo:-1,
                  descripcion:"",
                },
              monto: 0,
              usuarioActualiza: {
                idUsuario: -1
              },
              usuarioRegistro: {
                idUsuario: -1
              },
                }
        },
        error => {
          console.error('Error al registrar:', error);
          Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar el grupo' });
      }
    );
}
}
