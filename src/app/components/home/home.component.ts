import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { VibrateOnHoverDirective } from '../../directives/vibrate-on-hover.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [VibrateOnHoverDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(FirebaseAuthService);
}
