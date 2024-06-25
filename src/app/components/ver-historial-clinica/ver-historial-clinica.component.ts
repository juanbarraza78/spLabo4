import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { historialInterfaceID } from '../../interface/historialClinica.interface';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-ver-historial-clinica',
  standalone: true,
  imports: [],
  templateUrl: './ver-historial-clinica.component.html',
  styleUrl: './ver-historial-clinica.component.css',
})
export class VerHistorialClinicaComponent {
  authService = inject(FirebaseAuthService);
  historialService = inject(HistorialClinicaService);

  listaHistorial: historialInterfaceID[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      const currentUser = this.authService.currentUserSig();
      if (currentUser?.rol === 'paciente') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data.filter((historial) => {
              return historial.mailPaciente === userEmail;
            });
          });
        }
      } else if (currentUser?.rol === 'especialista') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data.filter((historial) => {
              return historial.mailEspecialistas.includes(userEmail);
            });
          });
        }
      } else if (currentUser?.rol === 'admin') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data;
          });
        }
      }
    }, 2500);
  }

  descargarPDF(historial: historialInterfaceID) {
    const doc = new jsPDF();
    doc.addImage('../../../assets/imgs/logo.png', 'PNG', 10, 10, 60, 30);
    doc.setFont('Helvetica');
    doc.setFontSize(40);
    doc.text('La Clinica', 80, 20);

    doc.setFontSize(30);
    doc.text('Historial Clinico', 80, 30);

    doc.setFontSize(25);
    doc.text(`Paciente: ${historial.mailPaciente}`, 10, 60);

    doc.setFontSize(20);
    doc.text(`Altura: ${historial.altura}`, 10, 70);
    doc.text(`Peso: ${historial.peso}`, 10, 80);
    doc.text(`Temperatura: ${historial.temperatura}`, 10, 90);
    doc.text(`Precion: ${historial.precion}`, 10, 100);
    doc.text(
      `${historial.arrayObservaciones[0]}: ${historial.arrayObservaciones[1]}`,
      10,
      110
    );
    doc.text(
      `${historial.arrayObservaciones[2]}: ${historial.arrayObservaciones[3]}`,
      10,
      120
    );
    doc.text(
      `${historial.arrayObservaciones[4]}: ${historial.arrayObservaciones[5]}`,
      10,
      130
    );

    doc.save(`${historial.mailPaciente}_hitorial_clinica.pdf`);
  }
}
