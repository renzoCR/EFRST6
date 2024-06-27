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

@Component({
  selector: 'app-consulta-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-data-catalogo.component.html',
  styleUrl: './consulta-data-catalogo.component.css'
})
export class ConsultaDataCatalogoComponent {
  descripcion: string = '';
  estado: boolean = true;
  idCatalogo: number = -1;
  lstCatalogo: Catalogo[] = [];
  dataSource: any;
  displayedColumns = ["idDataCatalogo","descripcion","estado","tipoCatalogo"];
  @ViewChild (MatPaginator, {static:true}) paginator!: MatPaginator;
constructor(private dataCatalogoService: DataCatalogoService,
  private utilService: UtilService){

}
ngOnInit() {
  console.log(">>> OnInit [inicio]");
  this.utilService.listaCatalogo().subscribe(
      x=> this.lstCatalogo = x
  );
  console.log(">>> ngOnInit [fin]");
  }
  consultar(){
    console.log(">>> consultar [inicio]");
    console.log("descripcion: ", this.descripcion);
    console.log("estado: ", this.estado);
    console.log("idCatalogo: ", this.idCatalogo);

    this.dataCatalogoService.consultaDataCatalogo(this.descripcion, this.estado?1:0, this.idCatalogo).subscribe(
      data => {
        this.dataSource = data;
        this.dataSource.paginator = this.paginator;
      }
    );
    console.log (">>> consultar [fin]");
  }
}
