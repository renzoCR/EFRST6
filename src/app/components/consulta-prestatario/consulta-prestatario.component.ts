import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { UtilService } from '../../services/util.service';
import { EjemploService } from '../../services/ejemplo.service';
import { Pais } from '../../models/pais.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { LoginComponent } from '../../auth/login.component';
import { PrestatarioService } from '../../services/prestatario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-consulta-prestatario',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-prestatario.component.html',
  styleUrl: './consulta-prestatario.component.css'
})
export class ConsultaPrestatarioComponent {
  //Filtro de la consulta
  nombres: string = "";
  estado: number = 0;
  dni: number = 0;
  login: string = "";

  //Datos para la Grila
  dataSource: any;

  //Clase para la paginacion
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idEjemplo", "descripcion", "dias", "longitud", "pais", "ubigeo", "estado"];

  constructor(private PrestatarioService: PrestatarioService,
    private utilService: UtilService) {
  }

  ngOnInit() {
    console.log(">>> ngOnInit [ini]");
    console.log(">>> ngOnInit [fin]");
  }

  consultar() {
    console.log(">>> consultar [ini]");
    console.log("nombres: ", this.nombres);
    console.log("estado: ", this.estado);
    console.log("dni: ", this.dni);
    console.log("login: ", this.login);

    this.PrestatarioService.consultaPrestatario(this.nombres,
      this.estado ? 1 : 0,
      this.dni.toString() == "" ? -1 : this.dni,
      this.login).subscribe(
        data => {
          this.dataSource = data;
          this.dataSource.paginator = this.paginator;
          console.log(">>> consultar [fin]");
        },
        error => {
          console.error("Error al consultar: ", error);
          if (error.status === 404) {
            Swal.fire({
              icon: 'info',
              title: 'No se encontraron resultados',
              text: 'No se encontraron usuarios que coincidan con los criterios de búsqueda.',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al procesar la solicitud. Intente nuevamente.',
            });
          }
        }
      );
  }



}
