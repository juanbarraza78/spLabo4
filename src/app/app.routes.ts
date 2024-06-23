import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'registerPacientes',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'registerEspecialistas',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/usuarios/usuarios.component').then(
        (m) => m.UsuariosComponent
      ),
  },
  {
    path: 'menuRegistros',
    loadComponent: () =>
      import('./components/nav-registro/nav-registro.component').then(
        (m) => m.NavRegistroComponent
      ),
  },
  {
    path: 'solicitarTurno',
    loadComponent: () =>
      import('./components/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
  },
  {
    path: 'misTurnos',
    loadComponent: () =>
      import('./components/mis-turnos/mis-turnos.component').then(
        (m) => m.MisTurnosComponent
      ),
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./components/turnos/turnos.component').then(
        (m) => m.TurnosComponent
      ),
  },
  {
    path: 'miPerfil',
    loadComponent: () =>
      import('./components/mi-perfil/mi-perfil.component').then(
        (m) => m.MiPerfilComponent
      ),
  },
  {
    path: 'horariosEspecialistas',
    loadComponent: () =>
      import(
        './components/horarios-especialistas/horarios-especialistas.component'
      ).then((m) => m.HorariosEspecialistasComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
