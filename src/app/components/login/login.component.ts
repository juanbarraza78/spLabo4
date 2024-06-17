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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  toastAlert = inject(ToastrService);
  fb = inject(FormBuilder);
  authService = inject(FirebaseAuthService);
  router = inject(Router);
  elementRef = inject(ElementRef);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const value = this.form.getRawValue();
    this.authService
      .login(value.email, value.password)
      .then((r) => {
        if (r.user.emailVerified) {
          this.authService.getUsuario(value.email).then((r) => {
            if (r.rol == 'especialista') {
              if (r.estaValidado) {
                this.router.navigateByUrl('/');
              } else {
                this.toastAlert.info(
                  'Email todavia no esta validado',
                  'Intentelo mas tarde'
                );
                this.authService.logout();
              }
            } else {
              this.router.navigateByUrl('/');
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

  userA() {
    this.form.setValue({ email: 'kopop74796@idsho.com', password: 'asd123' });
  }
  userB() {
    this.form.setValue({ email: 'palmiharze@gufum.com', password: 'asd123' });
  }
  userC() {
    this.form.setValue({
      email: 'jeniffer93408@wlks.crankymonkey.info',
      password: 'asd123',
    });
  }
}
