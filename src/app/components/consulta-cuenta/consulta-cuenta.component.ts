import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MatPaginator } from '@angular/material/paginator';
import { CuentaService } from '../../services/cuenta.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-consulta-cuenta',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-cuenta.component.html',
  styleUrl: './consulta-cuenta.component.css'
})
export class ConsultaCuentaComponent {
  //lista de Entidades Financieras
  lstTipoEntidad: DataCatalogo[] = [];

  //lista de monedas
  lstMoneda: DataCatalogo[] = [];

  //Filtro de la consulta
  numero: string = "";
  idDataCalogo: string = "-1";
  estado: boolean = true;
  idTipoMoneda:  string = "-1";

  //Datos para la Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idCuenta","numero","entidadFinanciera","tipoMoneda","estado"];

  constructor(private cuentaService: CuentaService,
    private utilService: UtilService) {
}

ngOnInit() {
  console.log(">>> ngOnInit [ini]");
  this.utilService.listaTipoEntidadBancaria().subscribe(
    data => { this.lstTipoEntidad = data; }
  );
  this.utilService.listaTipoMoneda().subscribe(
    tipos => this.lstMoneda = tipos
  )
  console.log(">>> ngOnInit [fin]");
}

consultar() {
  console.log(">>> consultar [ini]");
  console.log("número: ", this.numero);
  console.log("idDataCalogo: ", this.idDataCalogo);
  console.log("estado: ", this.estado);
  console.log("idTipoMoneda: ", this.idTipoMoneda);


  this.cuentaService.consultaCuenta(this.numero, this.idDataCalogo, this.estado?1:0, this.idTipoMoneda).subscribe(
    data => {
      this.dataSource = data;
      this.dataSource.paginator = this.paginator;
    }
  );
  console.log(">>> consultar [fin]");
}
}
