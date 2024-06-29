import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../services/util.service';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';

@Component({
  selector: 'app-consulta-grupo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-monto-prestamo.component.html',
  styleUrl: './consulta-monto-prestamo.component.css'
})
export class ConsultaMontoPrestamoComponent {
  dia: string = "";
  monto: string = "";
  capital: string = "";
  estado: boolean = true;
  estadoaux: number = 1;
  dataSource:any;
  dias : DataCatalogo[] = []
  displayedColumns = ["IDMontoPrestamo", "Capital", "Dias", "Monto", "Estado"];
  @ViewChild (MatPaginator,{static: true}) pagina!: MatPaginator;
  constructor(private utilService: UtilService, private service:MontoPrestamoService){
  }
  ngOnInit() {
    console.log(">>> OnInit [inicio]");
    this.utilService.listaDiasPrestamo().subscribe(
        x => this.dias = x
    );
    }
  consulta(){
    this.estadoaux = this.estado ? 1 : 0
    if (this.capital == "" || this.capital == null){
      this.capital = "-1"
    }
    if (this.monto == "" || this.monto == null){
      this.monto = "-1"
    }
    if (this.dia == ""){
      this.dia = "-1"
    }
    this.service.consulta(this.dia,this.capital,this.monto,this.estadoaux).subscribe(x =>{
      this.dataSource = new MatTableDataSource<MontoPrestamo>(x);
      this.dataSource.pagina = this.pagina
    },  error => {
      console.error("ERROR! Cuando se consulta los datos:", error);
    });
    console.log("consulta [final]");
    this.capital = ""
    this.monto = ""
  }
}

