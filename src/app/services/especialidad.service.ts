import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  especialidadInterface,
  especialidadInterfaceID,
} from '../interface/especialidad.interface';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, 'especialidad');

  getEspecialidad() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      especialidadInterfaceID[]
    >;
  }
  createEspecialidad(user: especialidadInterface) {
    return addDoc(this._collection, user);
  }
  updateEspecialidad(id: string, user: especialidadInterface) {
    return updateDoc(this.document(id), { ...user });
  }
  deleteEspecialidad(id: string) {
    return deleteDoc(this.document(id));
  }
  private document(id: string) {
    return doc(this._firestore, `${'especialidad'}/${id}`);
  }
}
