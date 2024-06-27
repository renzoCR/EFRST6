import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Ubigeo } from '../../models/ubigeo.model';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../services/util.service';
import { GrupoService } from '../../services/grupo.service';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from '../../models/grupo.model';

@Component({
  selector: 'app-consulta-grupo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-grupo.component.html',
  styleUrl: './consulta-grupo.component.css'
})
export class ConsultaGrupoComponent {
  descripcion: string = '';
  estado: boolean = true;
  leDepartamento: String = '-1';
  leProvincia: string = '-1';
  leDistrito: number = -1;
  departamento : string[] = [];
  provincia : string[] = [];
  distrito : Ubigeo[] = [];
  dataSource:any;
  displayedColumns = ["idGrupo", "descripcion", "ubigeo", "lider", "estado"];
  @ViewChild (MatPaginator,{static: true}) pagina!: MatPaginator;
  constructor(private utilservice: UtilService, private grupoService:GrupoService){
    this.utilservice.listarDepartamento().subscribe(x => this.departamento = x);
  }
  runProvincia(){
    console.log("" + this.leDepartamento);
    this.utilservice.listaProvincias(this.leDepartamento).subscribe(x => this.provincia = x);
  }
  runDistrito(){
    console.log("lisDepart" + this.leDepartamento);
    console.log("lisPro" + this.leProvincia);
    this.utilservice.listaDistritos(this.leDepartamento, this.leProvincia).subscribe(x => this.distrito = x);
  }
  consulti(){
    console.log("consultar [inicio]");
    console.log("descripcion:", this.descripcion);
    console.log("estado:", this.estado);
    console.log("distrito", this.leDistrito);
    this.grupoService.consultitaGrupo(this.descripcion, this.estado ? 1 : 0, this.leDistrito).subscribe(x =>{
      this.dataSource = new MatTableDataSource<Grupo>(x);
      this.dataSource.pagina = this.pagina
    },  error => {
      console.error("ERROR! Cuando se consulta los datos:", error);
    });
    console.log("consulta [final]");
  }
}
