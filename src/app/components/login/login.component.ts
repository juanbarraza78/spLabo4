import { Component, ElementRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecaptchaModule } from 'ng-recaptcha';
import { LogInterface } from '../../interface/log.interface';
import { LogsService } from '../../services/logs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  toastAlert = inject(ToastrService);
  fb = inject(FormBuilder);
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  logService = inject(LogsService);
  datePipe = inject(DatePipe);

  imgUsuario1?: string;
  imgUsuario2?: string;
  imgUsuario3?: string;
  imgUsuario4?: string;
  imgUsuario5?: string;
  imgUsuario6?: string;

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  executeRecaptcha(token: any) {
    console.log(token);
  }

  onSubmit(): void {
    const value = this.form.getRawValue();
    this.authService
      .login(value.email, value.password)
      .then((r) => {
        if (r.user.emailVerified) {
          this.authService.getUsuario(value.email).then((r) => {
            if (r.rol == 'especialista') {
              if (r.estaValidado) {
                this.authService.mailActual = value.email;
                this.authService.passActual = value.password;
                const logAux: LogInterface = {
                  email: value.email,
                  date: this.getFechaActual(),
                  time: this.getHorarioActual(),
                };
                this.logService.saveAll(logAux).then(() => {
                  this.router.navigateByUrl('/');
                });
              } else {
                this.toastAlert.info(
                  'Email todavia no esta validado',
                  'Intentelo mas tarde'
                );
                this.authService.logout();
              }
            } else {
              this.authService.mailActual = value.email;
              this.authService.passActual = value.password;
              const logAux: LogInterface = {
                email: value.email,
                date: this.getFechaActual(),
                time: this.getHorarioActual(),
              };
              this.logService.saveAll(logAux).then(() => {
                this.router.navigateByUrl('/');
              });
            }
          });
        } else {
          this.toastAlert.info('Verifique su email', 'Intentelo mas tarde');
          this.authService.logout();
        }
      })
      .catch(() => {
        this.toastAlert.error('Email o Password incorrect', 'Login Error');
      });
  }

  ngOnInit(): void {
    this.obtenerImgUsuario();
  }
  getFechaActual(): string {
    const fecha = new Date();
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  getHorarioActual(): string {
    const horario = new Date();
    return this.datePipe.transform(horario, 'HH:mm') || '';
  }

  obtenerImgUsuario() {
    this.authService.getUsuario('nafime2247@exeneli.com').then((r) => {
      this.imgUsuario1 = r.imagenUno;
    });
    this.authService.getUsuario('geyopi6943@exeneli.com').then((r) => {
      this.imgUsuario2 = r.imagenUno;
    });
    this.authService.getUsuario('lehav36586@gawte.com').then((r) => {
      this.imgUsuario3 = r.imagenUno;
    });
    this.authService.getUsuario('wekifem262@luravell.com').then((r) => {
      this.imgUsuario4 = r.imagenUno;
    });
    this.authService.getUsuario('nixaxed356@gawte.com').then((r) => {
      this.imgUsuario5 = r.imagenUno;
    });
    this.authService.getUsuario('keniyaf458@lisoren.com').then((r) => {
      this.imgUsuario6 = r.imagenUno;
    });
  }
  // Especialistas
  userA() {
    this.form.setValue({ email: 'nafime2247@exeneli.com', password: '123123' });
  }
  userB() {
    this.form.setValue({ email: 'geyopi6943@exeneli.com', password: '123123' });
  }
  // Pacientes
  userC() {
    this.form.setValue({
      email: 'lehav36586@gawte.com',
      password: '123123',
    });
  }
  userD() {
    this.form.setValue({
      email: 'wekifem262@luravell.com',
      password: '123123',
    });
  }
  userE() {
    this.form.setValue({
      email: 'nixaxed356@gawte.com',
      password: '123123',
    });
  }
  // Admin
  userF() {
    this.form.setValue({
      email: 'keniyaf458@lisoren.com',
      password: '123123',
    });
  }
}
