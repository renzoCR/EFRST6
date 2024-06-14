import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl, FormGroup } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { PrestatarioService } from '../../services/prestatario.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2'
import { map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agregar-prestatario',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-prestatario.component.html',
  styleUrl: './agregar-prestatario.component.css',
  providers: [DatePipe] 

})
export class AgregarPrestatarioComponent implements OnInit{

  objUsuario: Usuario = {};
  prestatario: Usuario = new Usuario();

  constructor(
    private prestatarioServices: PrestatarioService,
    private router: Router,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) 
  { }
  ngOnInit(): void {
    this.objUsuario.idUsuario = this.tokenService.getUserId();

  }
  guardarPrestatario() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss') || '';
    this.prestatario.fechaRegistro = formattedDate
    this.prestatario.fechaActualizacion = formattedDate
    this.prestatario.usuarioRegistro = this.objUsuario.idUsuario;
    this.prestatario.usuarioActualiza = this.objUsuario.idUsuario;
    this.prestatario.usuarioSuperior = this.objUsuario.idUsuario;
    this.prestatario.estado = 1;

    this.prestatarioServices.registrar(this.prestatario).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
        this.prestatario = {
          nombres: "",
          apellidos: "",
          dni: -1,
          login: "",
          correo: "",
          password: "",
          fechaNacimiento: "",
          fechaRegistro: " ",
          fechaActualizacion: "",
          usuarioRegistro: -1,
          usuarioActualiza:-1,
          estado: 1
          
        }
      }
    );
  }


  onSubmit() {
    console.log(this.prestatario); 
    console.log("Nombre " + this.prestatario.nombres);
    this.guardarPrestatario();  }

}