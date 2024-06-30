import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { MatDialog } from '@angular/material/dialog';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { TokenType } from '@angular/compiler';
import { TokenService } from '../../security/token.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CrudMontoPrestamoAgregarComponent } from '../crud-monto-prestamo-agregar/crud-monto-prestamo-agregar.component';
import { CrudMontoPrestamoActualizarComponent } from '../crud-monto-prestamo-actualizar/crud-monto-prestamo-actualizar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-monto-prestamo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-monto-prestamo.component.html',
  styleUrl: './crud-monto-prestamo.component.css'
})
export class CrudMontoPrestamoComponent {
  dataSource:any;
  @ViewChild (MatPaginator,{static:true}) pagina!: MatPaginator;
  displayedColumns = ["IDMontoPrestamo", "Capital", "Dias", "Monto", "Estado", "Acciones"];
  filtro: string = "";
  monto: MontoPrestamo = {};
  constructor(private dialogService:MatDialog, private service: MontoPrestamoService, private tokenService: TokenService){
  }
  ngOnInit() {
    this.refresh();
  }

  filtrar(){
    console.log(this.filtro)
    if (this.filtro == "" || this.filtro == null){
      this.refresh()
      return
    }
    console.log("refreshTable [inic]"); 
    this.service.montoPrestamoListaPorDias2(this.filtro).subscribe(x =>{
      this.dataSource = new MatTableDataSource<MontoPrestamo>(x);
      this.dataSource.pagina = this.pagina
    }); console.log("refreshTable [final]");
  }

  refresh(){
    console.log("refreshTable [inic]"); 
    this.service.lista().subscribe(x =>{
      this.dataSource = new MatTableDataSource<MontoPrestamo>(x);
      this.dataSource.pagina = this.pagina
    }); console.log("refreshTable [final]");
  }
  AbrirDialogRegistrar() {
    console.log("openDialogRegistrar [inic]");
    const dialogRef =this.dialogService.open(CrudMontoPrestamoAgregarComponent);
    dialogRef.afterClosed().subscribe(result =>{
      console.log('Dialogo cerrado con resultado',result);
      if (result != null && result === 1){
        this.refresh();
      }
    });
    console.log("OpenDialogRegistrar [final]");
  }
  Actualizar(obj: MontoPrestamo){
    console.log("openDialogActualizar [inic]");
    console.log("obj:" , obj);
    const dialogRef = this.dialogService.open(CrudMontoPrestamoActualizarComponent,{data: obj});
    dialogRef.afterClosed().subscribe(result =>{
      console.log('Dialogo cerrado con resultado: ', result);
      if(result != null && (result === 1 || result === 2)){
        this.refresh();
      }
    });
    console.log("openDialogActualizar [final]");
  }
  upEstado(obj:MontoPrestamo){
    console.log("update [inic]");
    console.log("obj", obj);
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.service.actualizar(obj).subscribe(x => {
      if (this.filtro == "" || this.filtro == null){
        this.refresh()
      }else{
        this.filtrar();
      }
    });
    console.log("updateEstado [final]");
  }
  eliminar(obj:MontoPrestamo){
    Swal.fire({
      title: 'Quieres eliminar?',
      text: "No hay vuelta atrás, seguro?",
      icon: 'warning',
      showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: ' eliminar',
            cancelButtonText: ' cancelar'
    }).then((result) =>{
      if (result.isConfirmed){
        this.service.eliminar(obj.idMontoPrestamo || 0).subscribe(x =>{
          this.refresh();
          Swal.fire('Message', x.mensaje, 'info');
        });
      }
    })
  }
}
