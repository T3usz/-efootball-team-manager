import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonAvatar,
  IonBadge,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trophy, 
  closeCircle, 
  removeCircle, 
  warning,
  checkmarkCircle,
  arrowBack,
  save,
  person
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { Player, Position } from '../../models/players.model';
import { JogadoresService } from '../../services/jogadores.service';

export interface MatchResult {
  playerId: string;
  playerName: string;
  result: 'victory' | 'defeat' | 'draw' | 'walkover';
  timestamp: Date;
}

@Component({
  selector: 'app-registrar-resultado',
  templateUrl: './registrar-resultado.page.html',
  styleUrls: ['./registrar-resultado.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonAvatar,
    IonBadge,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonTextarea,
    IonSpinner,
    IonButtons,
    IonBackButton
  ]
})
export class RegistrarResultadoPage implements OnInit, OnDestroy {
  private jogadoresService = inject(JogadoresService);
  private router = inject(Router);

  // Data
  jogadores: Player[] = [];
  jogadoresAtivos: Player[] = [];
  isLoading = false;
  error: string | null = null;

  // Form data
  selectedPlayerId: string = '';
  selectedResult: 'victory' | 'defeat' | 'draw' | 'walkover' = 'victory';
  matchDate: string = new Date().toISOString().split('T')[0];
  matchNotes: string = '';

  // UI state
  showPlayerSelector = false;
  showResultSelector = false;
  isSubmitting = false;

  private subscription: Subscription = new Subscription();

  constructor() {
    addIcons({ 
      trophy, 
      closeCircle, 
      removeCircle, 
      warning,
      checkmarkCircle,
      arrowBack,
      save,
      person
    });
  }

  ngOnInit() {
    this.subscribeToJogadores();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  subscribeToJogadores() {
    this.subscription.add(
      this.jogadoresService.jogadoresState$.subscribe(state => {
        this.jogadores = state.jogadores;
        this.jogadoresAtivos = this.jogadores.filter(j => j.isActive);
        this.isLoading = state.isLoading;
        this.error = state.error;
      })
    );
  }

  getSelectedPlayer(): Player | null {
    return this.jogadores.find(j => j.id === this.selectedPlayerId) || null;
  }

  getResultIcon(result: string): string {
    switch (result) {
      case 'victory': return 'trophy';
      case 'defeat': return 'close-circle';
      case 'draw': return 'remove-circle';
      case 'walkover': return 'warning';
      default: return 'person';
    }
  }

  getResultColor(result: string): string {
    switch (result) {
      case 'victory': return 'success';
      case 'defeat': return 'danger';
      case 'draw': return 'warning';
      case 'walkover': return 'medium';
      default: return 'primary';
    }
  }

  getResultLabel(result: string): string {
    switch (result) {
      case 'victory': return 'Vitória';
      case 'defeat': return 'Derrota';
      case 'draw': return 'Empate';
      case 'walkover': return 'WO';
      default: return 'Selecionar';
    }
  }

  getPositionColor(position: Position): string {
    const colors: Record<Position, string> = {
      GK: 'warning',
      CB: 'success',
      LB: 'success',
      RB: 'success',
      CM: 'primary',
      LM: 'primary',
      RM: 'primary',
      CAM: 'primary',
      ST: 'danger',
      LW: 'danger',
      RW: 'danger'
    };
    return colors[position] || 'medium';
  }

  async registrarResultado() {
    if (!this.selectedPlayerId) {
      await this.showToast('Selecione um jogador', 'warning');
      return;
    }

    const player = this.getSelectedPlayer();
    if (!player) {
      await this.showToast('Jogador não encontrado', 'danger');
      return;
    }

    this.isSubmitting = true;

    try {
      // Calculate new stats based on result
      const currentStats = player.stats;
      let newStats = { ...currentStats };

      switch (this.selectedResult) {
        case 'victory':
          newStats.victories += 1;
          break;
        case 'defeat':
          newStats.defeats += 1;
          break;
        case 'draw':
          newStats.draws += 1;
          break;
        case 'walkover':
          newStats.walkOvers += 1;
          break;
      }

      // Recalculate total matches and win rate
      newStats.totalMatches = newStats.victories + newStats.defeats + newStats.draws;
      newStats.winRate = newStats.totalMatches > 0 ? 
        Math.round((newStats.victories / newStats.totalMatches) * 100) : 0;

      // Update player stats
      await this.jogadoresService.atualizarEstatisticas(this.selectedPlayerId, newStats);

      // Show success message
      const resultLabel = this.getResultLabel(this.selectedResult);
      await this.showToast(`${player.name} - ${resultLabel} registrada!`, 'success');

      // Reset form
      this.resetForm();

    } catch (error: any) {
      console.error('Erro ao registrar resultado:', error);
      await this.showToast(error.message || 'Erro ao registrar resultado', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm() {
    this.selectedPlayerId = '';
    this.selectedResult = 'victory';
    this.matchDate = new Date().toISOString().split('T')[0];
    this.matchNotes = '';
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 3000;
    toast.position = 'top';
    toast.color = color;
    document.body.appendChild(toast);
    await toast.present();
  }

  voltar() {
    this.router.navigate(['/tabs/home']);
  }

  // Helper methods for UI
  getJogadoresOrdenados(): Player[] {
    return this.jogadoresAtivos.sort((a, b) => {
      // Sort by name first
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !== 0) return nameComparison;
      
      // Then by position
      return a.position.localeCompare(b.position);
    });
  }

  getPlayerDisplayName(player: Player): string {
    return `${player.name} (${player.position})${player.number ? ` - ${player.number}` : ''}`;
  }

  getPlayerStats(player: Player): string {
    const stats = player.stats;
    return `${stats.totalMatches} partidas - ${stats.winRate}% vitórias`;
  }

  getJogadoresComPartidas(): number {
    return this.jogadoresAtivos.filter(j => j.stats.totalMatches > 0).length;
  }
} 