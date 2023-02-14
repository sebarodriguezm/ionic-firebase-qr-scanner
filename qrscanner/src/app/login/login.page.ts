import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'; 
import { AlertController, LoadingController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  
  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public router: Router,
    public FirestoreService : FirestoreService,
    public loadController: LoadingController
    ) {
      this.formularioLogin = this.fb.group({
        'email': new FormControl("", Validators.email),
        'password': new FormControl("", Validators.minLength(6))
      })
    }

  ngOnInit() {
  }

  get email(){
    return this.formularioLogin.get('email');
  }

  get password(){
    return this.formularioLogin.get('password');
  }
  
  async login(){
    const loading = await this.loadController.create();
		await loading.present();
		const user = await this.FirestoreService.login(this.formularioLogin.value);
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/asistencia', { replaceUrl: true });
		} else {
			this.showAlert('Logueo invalido', 'Intentalo de nuevo!');
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

