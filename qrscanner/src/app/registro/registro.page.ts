import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;


  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public FirestoreService: FirestoreService,
    public loadingController: LoadingController,
    public router:Router
  ) {
    this.formularioRegistro = this.formBuilder.group({
      'email': new FormControl('', Validators.email),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      'confirmaPassword': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    }, {
      validator: this.passwordMatchValidator('password', 'confirmaPassword')
    });
  }
  ngOnInit() {}
 
  get email(){
    return this.formularioRegistro.get('email');
  }

  get password(){
    return this.formularioRegistro.get('password');
  }

  passwordMatchValidator(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ passwordMismatch: true });
      }
    };
  }


    async register(){
      //loading genera el efecto de carga mientras se realiza un proceso, es una barra animmada
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.formularioRegistro.invalid) {
      await loading.dismiss();
      this.showAlert('Registro fallido', 'Por favor completa los campos correctamente');
      return;
    }

    const user = await this.FirestoreService.register(this.formularioRegistro.value);
    await loading.dismiss();
  
    if (user) {
      this.router.navigateByUrl('/asistencia', { replaceUrl: true });
    } else {
      this.showAlert('Registro fallido', 'Intentalo de nuevo!');
    }
  }

   async showAlert(header: string, message: string) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['Aceptar']
		});
		await alert.present();
	}
}