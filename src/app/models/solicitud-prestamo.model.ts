import { DataCatalogo } from './dataCatalogo.model';
import { Usuario } from './usuario.model';

export class SolicitudPrestamo {
  idSolicitud?: number;
  capital?: number;
  dias?: DataCatalogo;
  montoPagar?: number;
  fechaInicioPrestamo?: string;
  fechaFinPrestamo?: string;
  estadoSolicitud?: DataCatalogo;
  estado?: number;
  fechaRegistro?: string;
  fechaActualizacion?: string;
  usuarioRegistro?: Usuario;
  usuarioActualiza?: Usuario;
  usuarioPrestatario?: Usuario;
}
