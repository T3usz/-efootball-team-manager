import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  LoadingController,
  IonIcon,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mail, 
  lockClosed, 
  eye, 
  eyeOff, 
  logoGoogle,
  arrowForward,
  person,
  checkmarkCircle,
  alertCircle
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonButton,
    IonIcon,
    IonCheckbox
  ]
})
export class LoginPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  returnUrl = '/tabs/home';

  constructor() {
    addIcons({ 
      mail, 
      lockClosed, 
      eye, 
      eyeOff, 
      logoGoogle,
      arrowForward,
      person,
      checkmarkCircle,
      alertCircle
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tabs/home';
    this.loadSavedCredentials();
  }

  private initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      const { email, password, rememberMe } = this.loginForm.value;
      
      const loading = await this.loadingController.create({
        message: 'Entrando...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        this.isLoading = true;
        await this.authService.signIn(email, password, rememberMe);
        
        await loading.dismiss();
        await this.showSuccessToast('Login realizado com sucesso!');
        this.router.navigate([this.returnUrl]);
        
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

  async signInWithGoogle() {
    if (this.isLoading) return;

    const loading = await this.loadingController.create({
      message: 'Conectando com Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.isLoading = true;
      await this.authService.signInWithGoogle();
      
      await loading.dismiss();
      await this.showSuccessToast('Login realizado com sucesso!');
      this.router.navigate([this.returnUrl]);
      
    } catch (error: any) {
      await loading.dismiss();
      if (error.message !== 'Login cancelado pelo usuário') {
        await this.showErrorToast(error.message);
      }
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  private loadSavedCredentials() {
    const savedCredentials = this.authService.getSavedCredentials();
    if (savedCredentials) {
      this.loginForm.patchValue({
        email: savedCredentials.email,
        password: savedCredentials.password,
        rememberMe: true
      });
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return 'Senha deve ter pelo menos 6 caracteres';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Senha'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
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

