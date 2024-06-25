import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  historialInterface,
  historialInterfaceID,
} from '../interface/historialClinica.interface';

const PATH = 'historialClinica';

@Injectable({
  providedIn: 'root',
})
export class HistorialClinicaService {
  router = inject(Router);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  mailPaciente: string = '';
  mailEspecialista: string = '';

  saveHistoriaClinica(historial: historialInterface) {
    return addDoc(this._collection, historial);
  }
  getHistoriaClinica() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      historialInterfaceID[]
    >;
  }
  async getHistoriaClinicaId(
    emailPaciente: string | undefined | null
  ): Promise<any> {
    const q = query(
      this._collection,
      where('mailPaciente', '==', emailPaciente)
    );
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return (
        {
          id: userDoc.id,
          ...userData,
        } || null
      );
    } else {
      return null;
    }
  }
  updateHistoriaClinica(id: string, turno: historialInterface) {
    const documet = doc(this._collection, id);
    return updateDoc(documet, { ...turno });
  }
  deleteHistoriaClinica(id: string) {
    const documet = doc(this._collection, id);
    deleteDoc(documet);
  }
}
