import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import {FormGroup,FormControl,Validators,FormBuilder}  from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import * as moment from 'moment';
import { getDocs, collection, Firestore, query,where } from '@angular/fire/firestore';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  condi: string;
  parametro: string ='';
   valor: string='';
  formularioBusqueda: FormGroup;
  arreglo_datos: any[] = [];

  qrdata: string;
  formularioFecha: FormGroup;
  fechaAsis: Date = new Date();


  //este método se usa para el qr dinamico con el datetime picker
  public initial_state = {
    qrdata: 'Ingresar Fecha ',
  };
//este método se usa para el qr dinamico con el datetime picker
  public data_model = {
    ...this.initial_state,
  };

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    public FirestoreService: FirestoreService,
    private firestore: Firestore
  ) {
    this.formularioFecha = this.formBuilder.group({
      fecha: new FormControl(new Date(), Validators.required),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });

    this.formularioBusqueda = this.formBuilder.group({
      'parametro': new FormControl(''),
      'valor': new FormControl(),
    });
//este método se usa para el qr dinamico con el datetime picker
    this.qrdata = this.data_model.qrdata;
  }


  ngOnInit() {
   
  }



  fecha2() {
    let fec = '';
    const bien = this.fechaAsis;
    moment.locale('es');
  let formattedDate = (moment(bien)).format('DD-MMMM-YYYY');
  localStorage.setItem('fecha', formattedDate);
  this.formularioFecha.value.fecha= formattedDate;
  fec = localStorage.getItem('fecha');
  this.qrdata=fec
  }

//este método se usa para el qr dinamico con el datetime picker
guardarFecha() {
  const f: string[] = [];
  console.log(this.formularioFecha.value);

  //this.FirestoreService.createFecha(this.formularioFecha.value);
  if (this.qrdata) {
    f.push(`[qrdata]="'${this.qrdata}'"`);
  }
}

  //este método se usa para el qr dinamico con el datetime picker
  strBuilder(): string {
    // featureList
    const f: string[] = [];
    if (this.qrdata) {
      f.push(`[qrdata]="'${this.qrdata}'"`);}
    return f.join('\n    ');
  }
 
  salir(){
    this.FirestoreService.logout();
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
