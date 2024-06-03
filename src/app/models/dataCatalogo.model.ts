import { Usuario } from "./usuario.model";

export class DataCatalogo {

    idDataCatalogo?: number;
    descripcion?: string;
    estado?: number;
    usuarioPrestatario?:Usuario;
    usuarioRegistro?:Usuario;
}
