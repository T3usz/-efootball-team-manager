import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mail, 
  lockClosed, 
  eye, 
  eyeOff, 
  arrowBack,
  checkmarkCircle,
  alertCircle,
  send
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class ForgotPasswordPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  forgotPasswordForm!: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor() {
    addIcons({ 
      mail, 
      arrowBack,
      checkmarkCircle,
      send
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid && !this.isLoading) {
      const { email } = this.forgotPasswordForm.value;
      
      const loading = await this.loadingController.create({
        message: 'Enviando email...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        this.isLoading = true;
        await this.authService.resetPassword(email);
        
        await loading.dismiss();
        this.emailSent = true;
        await this.showSuccessToast('Email de recuperação enviado!');
        
      } catch (error: any) {
        await loading.dismiss();
        await this.showErrorToast(error.message);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Email é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Toast helpers
  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle'
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger',
      icon: 'alert-circle'
    });
    await toast.present();
  }
}

