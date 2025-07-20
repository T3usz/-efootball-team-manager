import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { football, arrowForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon]
})
export class IntroPage {
  private router = inject(Router);

  constructor() {
    addIcons({ football, arrowForward });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
} 