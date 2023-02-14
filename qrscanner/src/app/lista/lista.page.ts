import { Component, OnInit } from '@angular/core';
import { Fecha, Asistencia } from '../interfaces/asistencia.interface';
import { FirestoreService } from '../services/firestore.service';
import { getDocs, collection, Firestore, query,where } from '@angular/fire/firestore';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  
  parametro: string ='';
   valor: string='';
  formularioBusqueda: FormGroup;
  arreglo_datos: any[] = [];
  fechas: Fecha[];
  asistencias: Asistencia[];

  constructor(
    public formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.firestoreService.getFecha().subscribe((fechas) => {
      this.fechas = fechas;
    }),
      this.firestoreService.getAsistencia().subscribe((asistencias) => {
        this.asistencias = asistencias;
      }),
      this.formularioBusqueda = this.formBuilder.group({
        'parametro': new FormControl(''),
        'valor': new FormControl(),
      });
  }

  async onClickDelete(asistencia: Asistencia) {
    const response = await this.firestoreService.deleteAsistencia(asistencia);
    console.log(response);
  }

  get campo(){
    return this.formularioBusqueda.get('campo');
  }

  get busqueda(){
    return this.formularioBusqueda.get('busqueda');
  }

  async buscar(parametro: string, valor: string) {
    const fechaRef = collection(this.firestore, 'asistencias');
    const q = query(fechaRef, where(parametro, '==', valor));
    const querySnapshot = await getDocs(q);
    const arreglo_docs = [];
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      arreglo_docs.push(doc.data());
    });
    this.arreglo_datos = arreglo_docs;

     /*const uid = await this.firestoreService.getUid()
    const path = 'alumnos/' +uid + '/asis/';
    this.nuevosSuscriber = this.firestoreService.getCollection<Asis>(path)
}*/
  }

  ingresarBusqueda(){
     this.parametro = this.formularioBusqueda.value.parametro
     this.valor = this.formularioBusqueda.value.valor
    const response = this.buscar(this.parametro, this.valor);
  }
}
