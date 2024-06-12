import { Ubigeo } from "./ubigeo.model";
import { Usuario } from "./usuario.model";

export class Grupo {
    idGrupo?:number; 
    descripcion?:string; 
    ubigeo?:Ubigeo;
    usuarioLider?:Usuario;
    estado?:number
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}
