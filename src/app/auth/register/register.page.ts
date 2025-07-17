import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonToast,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  ToastController,
  LoadingController
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
  arrowBack
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    IonToast,
    IonCheckbox,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class RegisterPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
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
      arrowBack
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tabs/home';
  }

  private initializeForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator for password confirmation
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      const { name, email, password } = this.registerForm.value;
      
      const loading = await this.loadingController.create({
        message: 'Criando conta...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        this.isLoading = true;
        await this.authService.signUp(email, password, name);
        
        await loading.dismiss();
        await this.showSuccessToast('Conta criada com sucesso!');
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

  async signUpWithGoogle() {
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
      await this.showSuccessToast('Conta criada com sucesso!');
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

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFormInvalid(errorType: string): boolean {
    return !!(this.registerForm.errors && this.registerForm.errors[errorType] && 
             this.registerForm.get('confirmPassword')?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${requiredLength} caracteres`;
      }
      if (field.errors['requiredTrue']) {
        return 'Você deve aceitar os termos de uso';
      }
    }
    
    // Check for form-level errors
    if (fieldName === 'confirmPassword' && this.isFormInvalid('passwordMismatch')) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      email: 'Email',
      password: 'Senha',
      confirmPassword: 'Confirmação de senha'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
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

