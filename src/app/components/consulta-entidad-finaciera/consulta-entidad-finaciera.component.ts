import { Component, Inject, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-consulta-entidad-finaciera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-entidad-finaciera.component.html',
  styleUrl: './consulta-entidad-finaciera.component.css'
})


export class ConsultaEntidadFinacieraComponent {

  departamentos: string[] = [];
  lstTipo: DataCatalogo[] = [];

  //Datos de la grilla
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

   //Cabecera
   displayedColumns = ["idEntidadFinanciera","nombre","gerente","tipoEntidad","ubigeo","estado",];

   //Filtro de la consulta
   nombre: string = "";
   gerente: string = "";
   tipoEntidad: number = -1;
   estado: boolean = true;
   @ViewChild (MatPaginator,{static: true}) pagina!: MatPaginator;
  constructor(private entidadService: EntidadFinancieraService,
    private utilService: UtilService,
    ){

    }

   ngOnInit() {
      console.log(">>> ngOnInit [ini]");
      this.utilService.listaTipoEntidadBancaria().subscribe(
        data => { this.lstTipo = data; }
      );
    
    }

    consultar() {
      console.log(">>> consultar [ini]");
      console.log("nombre: ", this.nombre);
      console.log("gerente: ", this.gerente);
      console.log("tipoEntidad: ", this.tipoEntidad);
      console.log("estado: ", this.estado);
      
      
      
      this.entidadService.consulta(this.nombre, this.gerente, this.tipoEntidad, this.estado?1:0).subscribe(
        data => {
          this.dataSource = data;
          this.dataSource.paginator = this.paginator;
        }
      );
      console.log(">>> consultar [fin]");
    }

    consult(){
      console.log("consultar [inicio]");
      console.log("nombre:", this.nombre);
      console.log("gerente:", this.gerente);
      console.log("tipoEntidad:", this.tipoEntidad);
      console.log("estado:", this.estado);
      
      this.entidadService.consulta(this.nombre, this.gerente, this.tipoEntidad, this.estado ? 1 : 0).subscribe(
        data => {
          this.dataSource = new MatTableDataSource<EntidadFinanciera>(data);
          this.dataSource.paginator = this.paginator; // Configura el paginador aquí
        },
        error => {
          console.error("ERROR! Cuando se consulta los datos:", error);
        }
      );
    
      console.log("consulta [final]");
    } 
}

