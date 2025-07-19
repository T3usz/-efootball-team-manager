import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonToggle,
  IonButtons,
  IonBackButton,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  person, 
  trophy, 
  documentText, 
  settings, 
  save, 
  close 
} from 'ionicons/icons';
import { JogadoresService } from '../../services/jogadores.service';
import { Position } from '../../models/players.model';

@Component({
  selector: 'app-adicionar-jogador',
  templateUrl: './adicionar-jogador.page.html',
  styleUrls: ['./adicionar-jogador.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonToggle,
    IonButtons,
    IonBackButton,
  ]
})
export class AdicionarJogadorPage implements OnInit {
  private jogadoresService = inject(JogadoresService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  jogadorForm!: FormGroup;
  isActive = true;
  isLoading = false;

  positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CM', 'LM', 'RM', 'CAM', 'ST', 'LW', 'RW'];

  constructor() {
    addIcons({ 
      person, 
      trophy, 
      documentText, 
      settings, 
      save, 
      close 
    });
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.jogadorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      nickname: [''],
      age: ['', [Validators.required, Validators.min(10), Validators.max(80)]],
      position: ['', Validators.required],
      number: ['', [Validators.min(1), Validators.max(99)]],
      observations: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.jogadorForm) return false;
    const field = this.jogadorForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    if (!this.jogadorForm) return '';
    const field = this.jogadorForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo é obrigatório';
    if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `Valor mínimo é ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valor máximo é ${field.errors['max'].max}`;

    return 'Campo inválido';
  }

  getPositionLabel(position: Position): string {
    const labels: Record<Position, string> = {
      GK: 'Goleiro',
      CB: 'Zagueiro',
      LB: 'Lateral Esquerdo',
      RB: 'Lateral Direito',
      CM: 'Meio-campo',
      LM: 'Meia Esquerdo',
      RM: 'Meia Direito',
      CAM: 'Meia Atacante',
      ST: 'Atacante',
      LW: 'Ponta Esquerda',
      RW: 'Ponta Direita'
    };
    return labels[position] || position;
  }

  async onSubmit() {
    if (this.jogadorForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Salvando jogador...'
    });
    await loading.present();

    try {
      const formValue = this.jogadorForm.value;
      const jogadorData = {
        name: formValue.name,
        nickname: formValue.nickname || null,
        age: formValue.age,
        position: formValue.position,
        number: formValue.number || null,
        observations: formValue.observations || null,
        isActive: this.isActive,
        stats: {
          speed: 0,
          shooting: 0,
          passing: 0,
          dribbling: 0,
          defending: 0,
          physical: 0,
          victories: 0,
          defeats: 0,
          draws: 0,
          walkOvers: 0,
          totalMatches: 0,
          winRate: 0
        }
      };

      await this.jogadoresService.adicionarJogador(jogadorData);
      
      await loading.dismiss();
      await this.showToast('Jogador adicionado com sucesso!', 'success');
      this.router.navigate(['/tabs/jogadores']);
      
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error.message || 'Erro ao adicionar jogador', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async onCancel() {
    if (this.jogadorForm.dirty) {
      const alert = await this.alertController.create({
        header: 'Confirmar Cancelamento',
        message: 'Tem certeza que deseja cancelar? As alterações serão perdidas.',
        buttons: [
          {
            text: 'Continuar Editando',
            role: 'cancel'
          },
          {
            text: 'Cancelar',
            role: 'destructive',
            handler: () => {
              this.router.navigate(['/tabs/jogadores']);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.router.navigate(['/tabs/jogadores']);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.jogadorForm.controls).forEach(key => {
      const control = this.jogadorForm.get(key);
      control?.markAsTouched();
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
} 