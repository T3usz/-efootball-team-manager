import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { home } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon]
})
export class NotFoundPage {
  private router = inject(Router);
  constructor() { addIcons({ home }); }
  goHome() { this.router.navigate(['/']); }
} 