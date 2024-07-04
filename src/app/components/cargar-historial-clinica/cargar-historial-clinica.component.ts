import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { historialInterface } from '../../interface/historialClinica.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cargar-historial-clinica',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cargar-historial-clinica.component.html',
  styleUrl: './cargar-historial-clinica.component.css',
})
export class CargarHistorialClinicaComponent {
  authService = inject(FirebaseAuthService);
  fb = inject(FormBuilder);
  historialService = inject(HistorialClinicaService);
  router = inject(Router);
  toastAlert = inject(ToastrService);

  form = this.fb.nonNullable.group({
    altura: [0, Validators.required],
    peso: [0, [Validators.required]],
    temperatura: [0, [Validators.required]],
    precion: [0, [Validators.required]],
    clave1: ['', [Validators.required]],
    valor1: ['', [Validators.required]],
    clave2: ['', [Validators.required]],
    valor2: ['', [Validators.required]],
    clave3: ['', [Validators.required]],
    valor3: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.form.valid) {
      let value = this.form.getRawValue();
      const historialAux: historialInterface = {
        altura: value.altura,
        peso: value.peso,
        temperatura: value.temperatura,
        precion: value.precion,
        arrayObservaciones: [
          value.clave1,
          value.valor1,
          value.clave2,
          value.valor2,
          value.clave3,
          value.valor3,
        ],
        mailPaciente: this.historialService.mailPaciente,
        mailEspecialistas: this.historialService.mailEspecialista,
        idTurno: this.historialService.idTurno,
        especialidad: this.historialService.especialidadEspecialista,
      };
      this.historialService.saveHistoriaClinica(historialAux).then(() => {
        this.toastAlert.success(
          'Se creo el historial clinico Correctamente',
          'Exito'
        );
      });

      this.form.reset();
      this.router.navigateByUrl('/misTurnos');
    }
  }
}
