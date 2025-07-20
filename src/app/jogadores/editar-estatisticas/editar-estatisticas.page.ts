import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  statsChart, 
  trophy, 
  save, 
  close,
  checkmarkCircle,
  closeCircle,
  removeCircle,
  warning
} from 'ionicons/icons';
import { PlayerStats } from '../../models/interfaces';
import { JogadoresService } from '../../services/jogadores.service';

@Component({
  selector: 'app-editar-estatisticas',
  templateUrl: './editar-estatisticas.page.html',
  styleUrls: ['./editar-estatisticas.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonBackButton,
  ]
})
export class EditarEstatisticasPage implements OnInit {
  private jogadoresService = inject(JogadoresService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  estatisticasForm!: FormGroup;
  isLoading = false;
  jogadorId: string = '';
  jogadorOriginal: any = null;
  estatisticasAtuais: PlayerStats | null = null;

  constructor() {
    addIcons({ 
      statsChart, 
      trophy, 
      save, 
      close,
      checkmarkCircle,
      closeCircle,
      removeCircle,
      warning
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
      message: 'Carregando estatísticas...'
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

      this.estatisticasAtuais = this.jogadorOriginal.stats;
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
    this.estatisticasForm = this.formBuilder.group({
      victories: [0, [Validators.required, Validators.min(0)]],
      defeats: [0, [Validators.required, Validators.min(0)]],
      draws: [0, [Validators.required, Validators.min(0)]],
      walkOvers: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private populateForm() {
    if (this.estatisticasAtuais) {
      this.estatisticasForm.patchValue({
        victories: this.estatisticasAtuais.victories,
        defeats: this.estatisticasAtuais.defeats,
        draws: this.estatisticasAtuais.draws,
        walkOvers: this.estatisticasAtuais.walkOvers
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.estatisticasForm) return false;
    const field = this.estatisticasForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    if (!this.estatisticasForm) return '';
    const field = this.estatisticasForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo é obrigatório';
    if (field.errors['min']) return 'Valor mínimo é 0';

    return 'Campo inválido';
  }

  getTotalMatches(): number {
    if (!this.estatisticasForm) return 0;
    const formValue = this.estatisticasForm.value;
    return formValue.victories + formValue.defeats + formValue.draws;
  }

  getWinRate(): number {
    if (!this.estatisticasForm) return 0;
    const totalMatches = this.getTotalMatches();
    if (totalMatches === 0) return 0;
    const formValue = this.estatisticasForm.value;
    return Math.round((formValue.victories / totalMatches) * 100);
  }

  async onSubmit() {
    if (this.estatisticasForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Salvando estatísticas...'
    });
    await loading.present();

    try {
      const formValue = this.estatisticasForm.value;
      const totalMatches = this.getTotalMatches();
      const winRate = this.getWinRate();

      const novasStats: PlayerStats = {
        ...this.estatisticasAtuais!,
        victories: formValue.victories,
        defeats: formValue.defeats,
        draws: formValue.draws,
        walkOvers: formValue.walkOvers,
        totalMatches: totalMatches,
        winRate: winRate
      };

      await this.jogadoresService.atualizarEstatisticas(this.jogadorId, novasStats);
      
      await loading.dismiss();
      await this.showToast('Estatísticas atualizadas com sucesso!', 'success');
      this.router.navigate(['/tabs/jogadores']);
      
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error.message || 'Erro ao atualizar estatísticas', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async onCancel() {
    if (this.estatisticasForm.dirty) {
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
    Object.keys(this.estatisticasForm.controls).forEach(key => {
      const control = this.estatisticasForm.get(key);
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