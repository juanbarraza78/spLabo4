import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Clinica';
  authService = inject(FirebaseAuthService);
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.getUsuario(user.email).then((r) => {
          this.authService.currentUserSig.set({
            email: user.email!,
            rol: r.rol,
          });
          console.log(this.authService.currentUserSig());
        });
      } else {
        this.authService.currentUserSig.set(null);
        console.log(this.authService.currentUserSig());
      }
    });
  }
}
