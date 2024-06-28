import { Component, Inject, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Catalogo } from '../../models/catalogo.model';
import { Data } from '@angular/router';

@Component({
  selector: 'app-consulta-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-data-catalogo.component.html',
  styleUrl: './consulta-data-catalogo.component.css'
})
export class ConsultaDataCatalogoComponent {
  lstCatalogo: Catalogo[] = [];

  descripcion: string = "";
  idCatalogo: number = -1;
  estado: boolean = true;

  dataSource: any;
  @ViewChild(MatPaginator,{static: true}) paginator!: MatPaginator;
  displayedColumns = ["idDataCatalogo","descripcion","idCatalogo","estado"];

  @ViewChild (MatPaginator,{static: true}) pagina!: MatPaginator;
  constructor(private dataCatalogoService: DataCatalogoService,
    private utilService: UtilService,){

    }
    ngOnInit() {
      console.log(">>> ngOnInit [ini]");
      this.utilService.listaDescripcion().subscribe(
        x => { this.lstCatalogo = x; }
      );
      console.log(">>> ngOnInit [fin]");
    }
    /*consultar() {
      console.log(">>> consultar [ini]");
      console.log("descripcion: ", this.descripcion);
      console.log("idCatalogo: ", this.idCatalogo);
      console.log("estado: ", this.estado);
      this.dataCatalogoService.consultaDataCatalogo(this.descripcion, this.estado?1:0, this.idCatalogo).subscribe(
        data => {
          this.dataSource = data;
          this.dataSource.paginator = this.paginator;
        }
      );
      console.log(">>> consultar [fin]");
    }*/
      consult() {
        console.log("consultar [inicio]");
        console.log("descripcion:", this.descripcion);
        console.log("idCatalogo:", this.idCatalogo);
        console.log("estado:", this.estado);
        
        this.dataCatalogoService.consultaDataCatalogo(this.descripcion, this.idCatalogo, this.estado ? 1 : 0).subscribe(
            data => {
                this.dataSource = new MatTableDataSource<DataCatalogo>(data);
                this.dataSource.paginator = this.paginator; // Configura el paginador aquí
            },
            error => {
                console.error("ERROR! Cuando se consulta los datos:", error);
            }
        );
    
        console.log("consulta [final]");
    }
}
