import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { LogInterface, LogInterfaceID } from '../interface/log.interface';
@Injectable({
  providedIn: 'root',
})
export class LogsService {
  firestore = inject(Firestore);

  saveAll(log: LogInterface) {
    const col = collection(this.firestore, 'logs');
    return addDoc(col, log);
  }
  getAll() {
    const col = collection(this.firestore, 'logs');
    return collectionData(col, { idField: 'id' }) as Observable<
      LogInterfaceID[]
    >;
  }
}
