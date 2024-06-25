export interface historialInterfaceID extends historialInterface {
  id: string;
}
export interface historialInterface {
  altura: number;
  peso: number;
  temperatura: number | undefined;
  precion: number | undefined;
  arrayObservaciones: string[];
  mailPaciente: string | undefined;
  mailEspecialistas: string[];
}
