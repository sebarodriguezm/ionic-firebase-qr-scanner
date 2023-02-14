import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  formularioAsis: FormGroup;
  scanActive: boolean = false;

  constructor(
    public FirestoreService: FirestoreService,
    public fb: FormBuilder
  ) {
    this.formularioAsis = this.fb.group({
      curso: new FormControl(''),
      fecha: new FormControl(''),
      nombre_alumno: new FormControl(''),
    });
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        alert(result.content);

        this.formularioAsis.value.fecha = result.content;
        this.FirestoreService.createAsistencia(this.formularioAsis.value);

      } else {
        alert('No hay datos!');
      }
    } else {
      alert('NO PERMITIDO!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
