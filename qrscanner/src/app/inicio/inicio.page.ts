import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormBuilder}  from '@angular/forms';
import { collection, query, where, getDocs } from 'firebase/firestore';
import * as moment from 'moment';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  condi: string;
  parametro: string ='';
   valor: string='';
  formularioBusqueda: FormGroup;
  arreglo_datos: any[] = [];



  constructor(
    public formBuilder: FormBuilder,
    private firestore: Firestore,
) { 
  this.formularioBusqueda = this.formBuilder.group({
    'parametro': new FormControl(''),
    'valor': new FormControl(''),
  });
  }

  ngOnInit() {
    
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

    const bien = this.formularioBusqueda.value.valor
    moment.locale('es');
    if (this.condi == 'fecha'){

    
    let formattedDate = (moment(bien)).format('DD-MMMM-YYYY');
this.formularioBusqueda.value.valor= formattedDate

   const response = this.buscar(this.parametro, this.formularioBusqueda.value.valor);
   console.log(this.formularioBusqueda.value.valor)}
   else{
     this.parametro = this.formularioBusqueda.value.parametro
    this.valor = this.formularioBusqueda.value.valor
    this.buscar(this.parametro, this.valor);
   }
 }

}
