import { Component, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EspecialidadService } from '../../services/especialidad.service';
import { especialidadInterfaceID } from '../../interface/especialidad.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  fb = inject(FormBuilder);
  toastAlert = inject(ToastrService);
  especialidadService = inject(EspecialidadService);

  arrayEspecialidades?: especialidadInterfaceID[];

  opcionAlta?: string = 'especialista';

  selectedFile1: File | null = null;
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;
  selectedFile4: File | null = null;

  ngOnInit(): void {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
  }

  onFileSelected1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }
  onFileSelected2(event: any) {
    this.selectedFile2 = event.target.files[0];
  }
  onFileSelected3(event: any) {
    this.selectedFile3 = event.target.files[0];
  }
  onFileSelected4(event: any) {
    this.selectedFile4 = event.target.files[0];
  }

  formPaciente = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', Validators.required],
    dni: ['', Validators.required],
    obraSocial: ['', Validators.required],
    mail: ['', Validators.required],
    foto1: ['', Validators.required],
    foto2: ['', Validators.required],
    password: ['', Validators.required],
  });
  async onSubmitPaciente() {
    if (this.formPaciente.valid && this.selectedFile1 && this.selectedFile2) {
      const value = this.formPaciente.getRawValue();
      this.authService
        .register(value.mail, value.password)
        .then(async () => {
          if (this.selectedFile1 && this.selectedFile2) {
            let respuesta = await this.authService.createUsuarioPaciente(
              value,
              this.selectedFile1,
              this.selectedFile2
            );
            if (respuesta) {
              this.router.navigateByUrl('/login');
              this.toastAlert.success('Email creado correctamente', 'Aceptado');
            } else {
              this.toastAlert.error(
                'Email creando alta o agregando imagen',
                'Error'
              );
            }
          }
        })
        .catch(() => {
          this.toastAlert.error('Error al registrar', 'Error');
        });
    }
  }

  formEspecialista = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', Validators.required],
    dni: ['', Validators.required],
    especialidad: ['', Validators.required],
    mail: ['', Validators.required],
    foto3: ['', Validators.required],
    password: ['', Validators.required],
    especialidadTexto: [''],
  });
  async onSubmitEspecialista() {
    if (this.formEspecialista.valid && this.selectedFile3) {
      const value = this.formEspecialista.getRawValue();
      this.authService
        .register(value.mail, value.password)
        .then(async () => {
          if (this.selectedFile3) {
            let respuesta = await this.authService.createUsuarioEspecialista(
              value,
              this.selectedFile3,
              value.especialidad
            );
            if (respuesta) {
              this.router.navigateByUrl('/login');
              this.toastAlert.success('Email creado correctamente', 'Aceptado');
            } else {
              this.toastAlert.error(
                'Email creando alta o agregando imagen',
                'Error'
              );
            }
          }
        })
        .catch(() => {
          this.toastAlert.error('Error al registrar', 'Error');
        });
    }
  }

  agregarEspecialidad() {
    let especialidadAgregar =
      this.formEspecialista.getRawValue().especialidadTexto;
    if (especialidadAgregar) {
      this.especialidadService.createEspecialidad({
        nombre: especialidadAgregar,
      });
    }
  }
}
