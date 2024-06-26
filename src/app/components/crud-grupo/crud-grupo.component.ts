import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Grupo } from '../../models/grupo.model';
import { MatDialog } from '@angular/material/dialog';
import { GrupoService } from '../../services/grupo.service';
import { TokenType } from '@angular/compiler';
import { TokenService } from '../../security/token.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CrudGrupoAgregarComponent } from '../crud-grupo-agregar/crud-grupo-agregar.component';
import { CrudGrupoActualizarComponent } from '../crud-grupo-actualizar/crud-grupo-actualizar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-grupo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-grupo.component.html',
  styleUrl: './crud-grupo.component.css'
})
export class CrudGrupoComponent {
  dataSource:any;
  @ViewChild (MatPaginator,{static:true}) pagina!: MatPaginator;
  displayedColumns = ["IDGrupo", "Descripcion", "Ubigeo", "Lider", "Estado", "Acciones"];
  filtro: string = "";
  objGrupo: Grupo = {};
  constructor(private dialogService:MatDialog, private grupoService: GrupoService, private tokenService: TokenService){
this.objGrupo.idGrupo = tokenService.getUserId();
  }
  refrescarTabla(){
    console.log("refreshTable [inic]"); 
    var cFiltrar = this.filtro == "" ? "todos": this.filtro;
    this.grupoService.listaGrupoPorNombreLike(cFiltrar).subscribe(x =>{
      this.dataSource = new MatTableDataSource<Grupo>(x);
      this.dataSource.pagina = this.pagina
    }); console.log("refreshTable [final]");
  }
  AbrirDialogRegistrar() {
    console.log("openDialogRegistrar [inic]");
    const dialogRef =this.dialogService.open(CrudGrupoAgregarComponent);
    dialogRef.afterClosed().subscribe(result =>{
      console.log('Dialogo cerrado con resultado',result);
      if (result != null && result === 1){
        this.refrescarTabla();
      }
    });
    console.log("OpenDialogRegistrar [final]");
  }
  Actualizar(obj: Grupo){
    console.log("openDialogActualizar [inic]");
    console.log("obj:" , obj);
    const dialogRef = this.dialogService.open(CrudGrupoActualizarComponent,{data: obj});
    dialogRef.afterClosed().subscribe(result =>{
      console.log('Dialogo cerrado con resultado: ', result);
      if(result != null && (result === 1 || result === 2)){
        this.refrescarTabla();
      }
    });
    console.log("openDialogActualizar [final]");
  }
  upEstado(obj:Grupo){
    console.log("update [inic]");
    console.log("obj", obj);
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.grupoService.actualizarGrupo(obj).subscribe(x => {
      this.refrescarTabla();
    
    });
    console.log("updateEstado [final]");
  }
  eliminar(obj:Grupo){
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
        this.grupoService.eliminarGrupo(obj.idGrupo || 0).subscribe(x =>{
          this.refrescarTabla();
          Swal.fire('Message', x.mensaje, 'info');
        });
      }
    })
  }
}
