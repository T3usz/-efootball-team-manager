import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  save,
  trash,
  camera,
  image,
  checkmarkCircle,
  alertCircle
} from 'ionicons/icons';
import { Team } from '../../shared/models/interfaces';
import { TeamService } from '../../services/team.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-editar-time',
  templateUrl: './editar-time.page.html',
  styleUrls: ['./editar-time.page.scss'],
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
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToast
  ]
})
export class EditarTimePage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private teamService = inject(TeamService);

  teamForm!: FormGroup;
  isLoading = false;
  team: Team | null = null;



  constructor() {
    addIcons({ 
      arrowBack,
      save,
      trash,
      camera,
      image,
      checkmarkCircle,
      alertCircle
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.loadTeamData();
  }

  private initializeForm() {
    this.teamForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      adminName: ['', [Validators.required, Validators.minLength(2)]],
      logo: ['']
    });
  }

  private loadTeamData() {
    // Carregar dados do time atual
    this.team = this.teamService.currentTeam;

    if (this.team) {
      this.teamForm.patchValue({
        name: this.team.name,
        adminName: this.team.adminName,
        logo: this.team.logo || ''
      });
    }
  }

  async onSubmit() {
    if (this.teamForm.valid && !this.isLoading) {
      const loading = await this.loadingController.create({
        message: 'Salvando alterações...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        this.isLoading = true;
        
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Atualizar dados do time
        if (this.team) {
          this.teamService.updateTeam({
            name: this.teamForm.value.name,
            adminName: this.teamForm.value.adminName,
            logo: this.teamForm.value.logo
          });
        }

        await loading.dismiss();
        await this.showSuccessToast('Time atualizado com sucesso!');
        this.router.navigate(['/tabs/home']);
        
      } catch (error: any) {
        await loading.dismiss();
        await this.showErrorToast('Erro ao salvar alterações');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        this.teamForm.patchValue({
          logo: image.dataUrl
        });
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  }

  async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        this.teamForm.patchValue({
          logo: image.dataUrl
        });
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.teamForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.teamForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${minLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome do time',
      adminName: 'Nome do administrador',
      modality: 'Modalidade'
    };
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched() {
    Object.keys(this.teamForm.controls).forEach(key => {
      const control = this.teamForm.get(key);
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