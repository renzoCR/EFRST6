import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { TokenService } from '../../security/token.service';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../models/usuario.model';
import { CrudEntidadFinancieraAgregarComponent } from '../crud-entidad-financiera-agregar/crud-entidad-financiera-agregar.component';
import { CrudGrupoActualizarComponent } from '../crud-grupo-actualizar/crud-grupo-actualizar.component';
import Swal from 'sweetalert2';
import { CrudEntidadFinancieraActualizarComponent } from '../crud-entidad-financiera-actualizar/crud-entidad-financiera-actualizar.component';

@Component({
  selector: 'app-crud-entidad-financiera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-entidad-financiera.component.html',
  styleUrl: './crud-entidad-financiera.component.css'
})
export class CrudEntidadFinancieraComponent {

  //Datos para la Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idEntidadFinanciera","nombre","gerente","tipoEntidad","ubigeo","estado","acciones"];

  //filtro de la consulta
  filtro: string = "";

  objUsuario: Usuario = {} ;

  constructor(private dialogService: MatDialog, 
    private EntidadFinancieraService: EntidadFinancieraService,
    private tokenService: TokenService ){
  this.objUsuario.idUsuario = tokenService.getUserId();
  }

  openDialogRegistrar() {
    console.log(">>> openDialogRegistrar [ini]");
    const dialogRef = this.dialogService.open(CrudEntidadFinancieraAgregarComponent);
    dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed with result:', result);
          if (result != null && result === 1) {
            this.refreshTable();
          }
    });
    console.log(">>> openDialogRegistrar [fin]");
  }

  openDialogActualizar(obj: EntidadFinanciera) {
    console.log(">>> openDialogActualizar [ini]");
    console.log("obj: ", obj);
    const dialogRef = this.dialogService.open(CrudEntidadFinancieraActualizarComponent, {data: obj} );
    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result != null && (result === 1 || result === 2)) {
              this.refreshTable();
        }
    });
    console.log(">>> openDialogActualizar [fin]");
  }

  refreshTable(){
    console.log(">>> refreshTable [ini]");
    var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
    this.EntidadFinancieraService.consultarCrud(msgFiltro).subscribe(
          x => {
            this.dataSource = new MatTableDataSource<EntidadFinanciera>(x);
            this.dataSource.paginator = this.paginator
          }
    );

    console.log(">>> refreshTable [fin]");
  }

  updateEstado(obj:EntidadFinanciera) {
    console.log(">>> updateEstado [ini]");
    console.log("obj: ", obj);
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.EntidadFinancieraService.actualizarCrud(obj).subscribe(
        x => {
            this.refreshTable();
        }
    );
     console.log(">>> updateEstado [fin]");
}

delete(obj: EntidadFinanciera) {
    Swal.fire({
      title: '¿Desea eliminar?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimina',
      cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {
                this.EntidadFinancieraService.eliminarCrud(obj.idEntidadFinanciera || 0).subscribe(
                      x => {
                            this.refreshTable();
                            Swal.fire('Mensaje', x.mensaje, 'info');
                      }
                );
            }
      })   
}


}
