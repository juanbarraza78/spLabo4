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
import { turnoInterface, turnoInterfaceID } from '../interface/turno.interface';

const PATH = 'turnos';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  router = inject(Router);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  saveTurno(turno: turnoInterface) {
    return addDoc(this._collection, turno);
  }
  getTurnos() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      turnoInterfaceID[]
    >;
  }
  async getTurno(id: string) {
    const q = query(this._collection, where('id', '==', id));
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return userData || null;
    } else {
      return null;
    }
  }
  updateTurno(id: string, turno: turnoInterface) {
    const documet = doc(this._collection, id);
    updateDoc(documet, { ...turno });
  }
  deleteTurno(id: string) {
    const documet = doc(this._collection, id);
    deleteDoc(documet);
  }
}
