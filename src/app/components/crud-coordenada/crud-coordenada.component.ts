import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Coordenada } from '../../models/coordenada.model';
import { CoordenadaService } from '../../services/coordenada.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../security/token.service';
import { CrudCoordenadaAgregarComponent } from '../crud-coordenada-agregar/crud-coordenada-agregar.component';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { CrudCoordenadaActualizarComponent } from '../crud-coordenada-actualizar/crud-coordenada-actualizar.component';
import { Ubigeo } from '../../models/ubigeo.model';

@Component({
  selector: 'app-crud-coordenada',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-coordenada.component.html',
  styleUrl: './crud-coordenada.component.css'
})
export class CrudCoordenadaComponent {

    dataSource:any;
    @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

    displayedColumns = ["idCoordenada","latitud","longitud","prestatario","ubigeo","estado","acciones"];

    //filtro de la consulta
    filtro: string = "";
  
    objCoordenada: Coordenada = {} ;
    
    
    constructor(private formBuilder: FormBuilder,
                private dialogService: MatDialog, 
                private coordenadaService: CoordenadaService,
                private tokenService: TokenService ){
   
    }

    
      

    formRegistrar = this.formBuilder.group({
      validaLatitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,5}))')]],
      validaLongitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,5}))')]],
      validaDepartamento: ['', [Validators.min(1)]],
      validaProvincia: ['', [Validators.min(1)]],
      validaDistrito: ['', [Validators.min(1)]],
      validaPrestatario: ['', [Validators.min(1)]],
    });

    departamentos: string[] = [];
    provincias: string[] = [];
    distritos: Ubigeo[] = [];
    lstPrestatarios: Usuario[] = [];
    objUsuario: Usuario = {};

    refreshTable(){
      console.log(">>> refreshTable [ini]");
      console.log(this.filtro)
      if(this.filtro==""){
          this.filtro = "0";
      }
      var mgFiltro =  this.filtro.toString(); 
      this.coordenadaService.consultarCrud(mgFiltro).subscribe(
            x => {
              this.dataSource = new MatTableDataSource<Coordenada>(x);
              this.dataSource.paginator = this.paginator
              console.log(x)
               
            }
      );
  
      console.log(">>> refreshTable [final]");
      this.filtro = ""
    }


    openDialogRegistrar() {
      console.log(">>> openDialogRegistrar [ini]");
      const dialogRef = this.dialogService.open(CrudCoordenadaAgregarComponent);
      dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed with result:', result);
            if (result != null && result === 1) {
              this.refreshTable();
            }
      });
      console.log(">>> openDialogRegistrar [fin]");
    }
  

    openDialogActualizar(obj: Coordenada) {
      console.log(">>> openDialogActualizar [ini]");
      console.log("obj: ", obj);
      const dialogRef = this.dialogService.open(CrudCoordenadaActualizarComponent, {data: obj} );
      dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed with result:', result);
          if (result != null && (result === 1 || result === 2)) {
                this.refreshTable();
          }
      });
      console.log(">>> openDialogActualizar [fin]");
    }
  
   

    updateEstado(obj:Coordenada, a:boolean) {
      console.log(">>> updateEstado [ini]");
      console.log("obj: ", a);
      this.objUsuario.idUsuario=this.tokenService.getUserId();
      obj.usuarioActualiza=this.objUsuario;
      obj.estado =  a ? 0 : 1;
      console.log(obj.estado)
      this.coordenadaService.actualizarCoordenada(obj,this.objUsuario.idUsuario!).subscribe(
          x => {
              this.refreshTable();
          }
      );
       console.log(">>> updateEstado [fin]");
  }
  
  
  delete(obj: Coordenada) {
      Swal.fire({
        title: '¿Seguro de eliminar?',
        text: "Los cambios no se van a revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, elimina',
        cancelButtonText: 'No, cancelar'
        }).then((result) => {
              if (result.isConfirmed) {
                  this.coordenadaService.eliminarCoordenada(obj.idCoordenada || 0).subscribe(
                        x => {
                              this.refreshTable();
                              Swal.fire('Mensaje', x.mensaje, 'info');
                        }
                  );
              }
        })   
  }


}
