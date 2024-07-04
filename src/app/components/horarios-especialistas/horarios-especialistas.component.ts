import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EspecialistaInterface } from '../../interface/especialista.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horarios-especialistas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './horarios-especialistas.component.html',
  styleUrl: './horarios-especialistas.component.css',
})
export class HorariosEspecialistasComponent {
  fb = inject(FormBuilder);
  authService = inject(FirebaseAuthService);
  toastAlert = inject(ToastrService);

  form = this.fb.nonNullable.group({
    deSemana: ['8', Validators.required],
    hastaSemana: ['19', Validators.required],
    deSabado: ['8', Validators.required],
    hastaSabado: ['14', Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.authService
        .getUsuarioId(this.authService.currentUserSig()?.email)
        .then((r) => {
          let data: EspecialistaInterface = {
            nombre: r.nombre,
            apellido: r.apellido,
            edad: r.edad,
            dni: r.dni,
            especialidad: r.especialidad,
            mail: r.mail,
            imagenUno: r.imagenUno,
            estaValidado: r.estaValidado,
            rol: r.rol,
            deSemana: parseInt(value.deSemana),
            hastaSemana: parseInt(value.hastaSemana),
            deSabado: parseInt(value.deSabado),
            hastaSabado: parseInt(value.hastaSabado),
            usuariosAtentidos: r.usuariosAtentidos,
          };
          this.authService
            .updateUsuarioEspecialista(r.id, data)
            .then(() => {
              this.toastAlert.success('Se modifico Correctamente', 'Exito');
            })
            .catch(() => {
              this.toastAlert.error('No se pudo Modificar', 'Error');
            });
        });
    } else {
      this.toastAlert.error('Datos Incorrectos', 'Error');
    }
  }
}
