import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../interface/user.interface';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { EspecialistaInterface } from '../interface/especialista.interface';
import { PacienteInterface } from '../interface/paciente.interface';
import { AdminInterface } from '../interface/admin.interface';

const PATH = 'usuarios';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  mailActual: string = '';
  passActual: string = '';
  //Auth
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  register(email: string, password: string) {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((r) => {
      sendEmailVerification(r.user);
      this.logout();
    });
    return promise;
  }
  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return promise;
  }
  logout() {
    const promise = signOut(this.firebaseAuth);
    return promise;
  }

  // Firestorage
  router = inject(Router);
  private _firestore = inject(Firestore);
  private storage = inject(Storage);
  private _collection = collection(this._firestore, PATH);

  getUsuarios() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      any[]
    >;
  }
  async getUsuario(email: string | undefined | null): Promise<any> {
    const q = query(this._collection, where('mail', '==', email));
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return userData || null;
    } else {
      return null;
    }
  }

  async getUsuarioId(email: string | undefined | null): Promise<any> {
    const q = query(this._collection, where('mail', '==', email));
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
  updateUsuarioEspecialista(id: string, especialista: EspecialistaInterface) {
    return updateDoc(this.document(id), { ...especialista });
  }
  private document(id: string) {
    return doc(this._firestore, `${PATH}/${id}`);
  }
  async createUsuarioPaciente(paciente: any, foto1: File, foto2: File) {
    let hora = new Date().getTime();
    let ubicacion1 = '/' + paciente.nombre + hora + '1';
    let ubicacion2 = '/' + paciente.nombre + hora + '2';
    const imgRef1 = ref(this.storage, ubicacion1);
    const imgRef2 = ref(this.storage, ubicacion2);
    let retorno = false;
    let urlFoto1 = '';

    await uploadBytes(imgRef1, foto1).then(async () => {
      const url1 = await getDownloadURL(imgRef1).then(async (resultado) => {
        retorno = true;
        urlFoto1 = resultado;
      });
    });
    if (retorno) {
      await uploadBytes(imgRef2, foto2).then(async () => {
        const url2 = await getDownloadURL(imgRef2)
          .then(async (resultado) => {
            let data: PacienteInterface = {
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              edad: paciente.edad,
              dni: paciente.dni,
              obraSocial: paciente.obraSocial,
              mail: paciente.mail,
              imagenUno: urlFoto1,
              imagenDos: resultado,
              rol: 'paciente',
            };
            await addDoc(this._collection, data)
              .then(() => {
                retorno = true;
              })
              .catch(() => {
                retorno = false;
              });
          })
          .catch(() => {
            retorno = false;
          });
      });
    }
    return retorno;
  }
  async createUsuarioEspecialista(
    especialista: any,
    foto: File,
    especialidad: string
  ) {
    let hora = new Date().getTime();
    let ubicacion = '/' + especialista.nombre + hora;
    const imgRef = ref(this.storage, ubicacion);
    let retorno = false;
    await uploadBytes(imgRef, foto).then(async () => {
      const url1 = await getDownloadURL(imgRef).then(async (resultado) => {
        let data: EspecialistaInterface = {
          nombre: especialista.nombre,
          apellido: especialista.apellido,
          edad: especialista.edad,
          dni: especialista.dni,
          especialidad: especialidad,
          mail: especialista.mail,
          imagenUno: resultado,
          estaValidado: false,
          rol: 'especialista',
          deSemana: 8,
          hastaSemana: 19,
          deSabado: 8,
          hastaSabado: 14,
        };
        await addDoc(this._collection, data).then(() => {
          retorno = true;
        });
      });
    });
    return retorno;
  }
  async createUsuarioAdmin(admin: any, foto: File) {
    let hora = new Date().getTime();
    let ubicacion = '/' + admin.nombre + hora;
    const imgRef = ref(this.storage, ubicacion);
    let retorno = false;
    await uploadBytes(imgRef, foto).then(async () => {
      const url1 = await getDownloadURL(imgRef).then(async (resultado) => {
        let data: AdminInterface = {
          nombre: admin.nombre,
          apellido: admin.apellido,
          edad: admin.edad,
          dni: admin.dni,
          mail: admin.mail,
          imagenUno: resultado,
          rol: 'admin',
        };
        await addDoc(this._collection, data).then(() => {
          retorno = true;
        });
      });
    });
    return retorno;
  }
}
