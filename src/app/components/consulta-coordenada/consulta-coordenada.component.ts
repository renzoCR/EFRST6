import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../services/util.service';
import { CoordenadaService } from '../../services/coordenada.service';
import { MatTableDataSource } from '@angular/material/table';
import { Ubigeo } from '../../models/ubigeo.model';
import { Coordenada } from '../../models/coordenada.model';

@Component({
  selector: 'app-consulta-coordenada',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-coordenada.component.html',
  styleUrl: './consulta-coordenada.component.css'
})

export class ConsultaCoordenadaComponent {
    

  latitud :string="";
  estado: number = 1;
  estado2: number =1;

  Departamentos: String = '-1';
  Provincias: string = '-1';
  Distritos: number = -1;

  departamento : string[] = [];
  provincia : string[] = [];
  distrito : Ubigeo[] = [];

  dataSource:any;
  displayedColumns = ["idCoordenada", "latitud","ubigeo", "estado"];

  @ViewChild (MatPaginator,{static: true}) pagina!: MatPaginator;

  constructor(private utilservice: UtilService, private coordenadaService:CoordenadaService){
    this.utilservice.listarDepartamento().subscribe(x => this.departamento = x);
  }



  Provincia(){
    console.log("" + this.Departamentos);
    this.utilservice.listaProvincias(this.Departamentos).subscribe(x => this.provincia = x);
  }

  Distrito(){
    console.log("listaDepartamentos" + this.Departamentos);
    console.log("listaProvubcuas" + this.Provincia);
    this.utilservice.listaDistritos(this.Departamentos, this.Provincia).subscribe(x => this.distrito = x);
  }
  
  consultar(){
    console.log("consultar [inicio]");
    console.log("latitud:", this.latitud);
    console.log("estado:", this.estado);
    console.log("distrito", this.Distrito);
    this.coordenadaService.consultaCoordenada(
      this.latitud,
       this.estado2, 
       this.Distritos
     ).subscribe(
      x =>{
      this.dataSource = new MatTableDataSource<Coordenada>(x);
      this.dataSource.pagina = this.pagina
    },  error => {
      console.error("ERROR! Cuando se consulta los datos:", error);
    });
    console.log("consulta [final]");
  }
}


