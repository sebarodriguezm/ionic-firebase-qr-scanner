import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


//se crean interfaces para no usar objetos anonimos en el uso de los datos ya que no otorgan utilidad
import { Asistencia, Asis } from '../interfaces/asistencia.interface';
import { Fecha } from '../interfaces/asistencia.interface';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    //se inyecta firestore que permite trabajar con la base de datos firabse
    private firestore: Firestore,
    
    // se inyecta auth para usar la autentificación de firebase
    private auth: Auth,

    ) { }


    
   async register({email, password}: any){
      try {
        const user = await createUserWithEmailAndPassword(this.auth, email, password);
        return user;
      } catch (e) {
        return null;
      }
      
      //email y password no llevan el this. porque son parametros que vienen del formulario

    }
  
    async login({email, password}:any){
      try {
        const user = await signInWithEmailAndPassword(this.auth, email, password)
        return user;
      } catch (e) {
        return null;
      }
    }
  
    logout(){
      return signOut(this.auth);
    }

    createFecha(fecha:Fecha ){
      //collection nos permite acceder a las colecciones, fechaR es la referencia a la tabla
      const fechaR = collection(this.firestore, 'fechas');
      //se usa adddoc inyectada desde firestore para añadir, el segundo parametro es lo que se añade a firebase
       return addDoc(fechaR, fecha);
    }

    //se crea un observable para obtener los datos ya que nos permite suscribirnos y ver cambios en tiempo real
    getFecha(): Observable<Fecha[]> {
      const fechaRef = collection(this.firestore, 'fechas');
      //las llaves nos permiten establecer a través de que campo se organiza y luego es transforma todo a un observable con un array
      return collectionData(fechaRef, {  idField: 'id'}) as Observable<Fecha[]>;
    }
    
    //para borrar la referencia debe usar un id
    deleteFecha(fecha: Fecha) {
      const placeDocRef = doc(this.firestore, `fechas/${fecha.id}`);
      return deleteDoc(placeDocRef);
    }

    createAsistencia(asistencia:Asistencia ){
      const fechaA = collection(this.firestore, 'asistencias');
       return addDoc(fechaA, asistencia);
    }

    getAsistencia(): Observable<Asistencia[]> {
      const fechaRef = collection(this.firestore, 'asistencias');
      //las llaves nos permiten establecer a través de que campo se organiza y luego es transforma todo a un observable con un array
      return collectionData(fechaRef, {  idField: 'id'}) as Observable<Asistencia[]>;
    }

      deleteAsistencia(asistencia: Asistencia) {
      const placeDocRef = doc(this.firestore, `asistencias/${asistencia.id}`);
      return deleteDoc(placeDocRef);
    }

  }
