import { Usuario } from "./usuario.model";
import { Catalogo } from "./catalogo.model";

export class DataCatalogo {

    idDataCatalogo?: number;
    descripcion?: string;
    estado?: number;
    idCatalogo?:Catalogo;
    usuarioPrestatario?:Usuario;
    usuarioRegistro?:Usuario;
}
