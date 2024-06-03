import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';


@Component({
  selector: 'app-agregar-entidad-financiera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-entidad-financiera.component.html',
  styleUrl: './agregar-entidad-financiera.component.css'
})
export class AgregarEntidadFinancieraComponent {

}
