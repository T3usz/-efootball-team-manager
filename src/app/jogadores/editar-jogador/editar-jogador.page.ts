import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  close,
  trash
} from 'ionicons/icons';
import { Position } from '../../models/players.model';
import { JogadoresService } from '../../services/jogadores.service';

@Component({
  selector: 'app-editar-jogador',
  templateUrl: './editar-jogador.page.html',
  styleUrls: ['./editar-jogador.page.scss'],
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
export class EditarJogadorPage implements OnInit {
  private jogadoresService = inject(JogadoresService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  jogadorForm!: FormGroup;
  isActive = true;
  isLoading = false;
  jogadorId: string = '';
  jogadorOriginal: any = null;

  positions: Position[] = ['GK', 'CB', 'LB', 'RB', 'CM', 'LM', 'RM', 'CAM', 'ST', 'LW', 'RW'];

  constructor() {
    addIcons({ 
      person, 
      trophy, 
      documentText, 
      settings, 
      save, 
      close,
      trash
    });
  }

  ngOnInit() {
    this.jogadorId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.jogadorId) {
      this.showToast('Jogador não encontrado', 'danger');
      this.router.navigate(['/tabs/jogadores']);
      return;
    }
    
    this.loadJogador();
  }

  private async loadJogador() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Carregando jogador...'
    });
    await loading.present();

    try {
      this.jogadorOriginal = await this.jogadoresService.obterJogador(this.jogadorId);
      
      if (!this.jogadorOriginal) {
        await loading.dismiss();
        await this.showToast('Jogador não encontrado', 'danger');
        this.router.navigate(['/tabs/jogadores']);
        return;
      }

      this.isActive = this.jogadorOriginal.isActive;
      this.initForm();
      this.populateForm();
      
      await loading.dismiss();
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error.message || 'Erro ao carregar jogador', 'danger');
      this.router.navigate(['/tabs/jogadores']);
    } finally {
      this.isLoading = false;
    }
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

  private populateForm() {
    if (this.jogadorOriginal) {
      this.jogadorForm.patchValue({
        name: this.jogadorOriginal.name,
        nickname: this.jogadorOriginal.nickname || '',
        age: this.jogadorOriginal.age || '',
        position: this.jogadorOriginal.position,
        number: this.jogadorOriginal.number || '',
        observations: this.jogadorOriginal.observations || ''
      });
    }
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
      message: 'Salvando alterações...'
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
        isActive: this.isActive
      };

      await this.jogadoresService.atualizarJogador(this.jogadorId, jogadorData);
      
      await loading.dismiss();
      await this.showToast('Jogador atualizado com sucesso!', 'success');
      this.router.navigate(['/tabs/jogadores']);
      
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error.message || 'Erro ao atualizar jogador', 'danger');
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

  async removerJogador() {
    const alert = await this.alertController.create({
      header: 'Confirmar Remoção',
      message: `Tem certeza que deseja remover ${this.jogadorOriginal?.name}? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Remover',
          role: 'destructive',
          handler: async () => {
            try {
              await this.jogadoresService.removerJogador(this.jogadorId);
              await this.showToast(`${this.jogadorOriginal?.name} foi removido`, 'success');
              this.router.navigate(['/tabs/jogadores']);
            } catch (error: any) {
              await this.showToast(error.message || 'Erro ao remover jogador', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
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