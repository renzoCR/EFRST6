import { DataCatalogo } from './dataCatalogo.model';

export class MontoPrestamo {
  idMontoPrestamo?: number;
  capital?: number;
  dias?: DataCatalogo;
  monto?: number;
  estado?: number;
  fechaRegistro?: string;
  fechaActualizacion?: string;
  usuarioRegistro?: number;
  usuarioActualiza?: number;
}
