export interface turnoInterfaceID extends turnoInterface {
  id: string;
}
export interface turnoInterface {
  date: string;
  time: string;
  paciente: string | undefined;
  especialista: string | undefined;
  especialidad: string | undefined;
}