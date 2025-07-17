import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonAvatar,
  IonButton,
  IonIcon,
  IonBadge,
  IonFab,
  IonFabButton,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  AlertController,
  ToastController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add, 
  search, 
  person, 
  trophy, 
  warning,
  edit,
  trash,
  eye,
  filter,
  statsChart,
  checkmarkCircle,
  closeCircle,
  ellipsisVertical
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { Player, Position } from '../../shared/models/interfaces';
import { JogadoresService } from '../../services/jogadores.service';

@Component({
  selector: 'app-lista-jogadores',
  templateUrl: './lista-jogadores.page.html',
  styleUrls: ['./lista-jogadores.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonAvatar,
    IonButton,
    IonIcon,
    IonBadge,
    IonFab,
    IonFabButton,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonChip
  ]
})
export class ListaJogadoresPage implements OnInit, OnDestroy {
  private jogadoresService = inject(JogadoresService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private actionSheetController = inject(ActionSheetController);

  jogadores: Player[] = [];
  jogadoresFiltrados: Player[] = [];
  isLoading = false;
  error: string | null = null;

  // Filters and search
  searchTerm = '';
  selectedSegment: 'todos' | 'ativos' | 'inativos' | 'alertas' = 'todos';
  selectedPosition: Position | 'todas' = 'todas';

  // Statistics
  totalJogadores = 0;
  totalAtivos = 0;
  jogadoresComAlerta = 0;

  private subscription: Subscription = new Subscription();

  constructor() {
    addIcons({ 
      add, 
      search, 
      person, 
      trophy, 
      warning,
      edit,
      trash,
      eye,
      filter,
      statsChart,
      checkmarkCircle,
      closeCircle,
      ellipsisVertical
    });
  }

  ngOnInit() {
    this.subscribeToJogadores();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private subscribeToJogadores() {
    this.subscription.add(
      this.jogadoresService.jogadoresState$.subscribe(state => {
        this.jogadores = state.jogadores;
        this.isLoading = state.isLoading;
        this.error = state.error;
        
        this.updateStatistics();
        this.applyFilters();
      })
    );
  }

  private updateStatistics() {
    this.totalJogadores = this.jogadoresService.getTotalJogadores();
    this.totalAtivos = this.jogadoresService.getTotalJogadoresAtivos();
    this.jogadoresComAlerta = this.jogadoresService.getJogadoresComAlerta().length;
  }

  private applyFilters() {
    let filtered = [...this.jogadores];

    // Apply segment filter
    switch (this.selectedSegment) {
      case 'ativos':
        filtered = filtered.filter(j => j.isActive);
        break;
      case 'inativos':
        filtered = filtered.filter(j => !j.isActive);
        break;
      case 'alertas':
        filtered = filtered.filter(j => j.stats.walkOvers >= 3);
        break;
    }

    // Apply position filter
    if (this.selectedPosition !== 'todas') {
      filtered = filtered.filter(j => j.position === this.selectedPosition);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(j => 
        j.name.toLowerCase().includes(term) ||
        j.position.toLowerCase().includes(term) ||
        (j.number && j.number.toString().includes(term))
      );
    }

    this.jogadoresFiltrados = filtered;
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
    this.applyFilters();
  }

  async onRefresh(event: any) {
    // The service automatically updates via real-time listeners
    // Just complete the refresher after a short delay
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async adicionarJogador() {
    this.router.navigate(['/jogadores/adicionar']);
  }

  async verDetalhes(jogador: Player) {
    this.router.navigate(['/jogadores/detalhes', jogador.id]);
  }

  async editarJogador(jogador: Player) {
    this.router.navigate(['/jogadores/editar', jogador.id]);
  }

  async mostrarOpcoes(jogador: Player) {
    const actionSheet = await this.actionSheetController.create({
      header: jogador.name,
      buttons: [
        {
          text: 'Ver Detalhes',
          icon: 'eye',
          handler: () => this.verDetalhes(jogador)
        },
        {
          text: 'Editar',
          icon: 'edit',
          handler: () => this.editarJogador(jogador)
        },
        {
          text: 'Estatísticas',
          icon: 'stats-chart',
          handler: () => this.verEstatisticas(jogador)
        },
        {
          text: jogador.isActive ? 'Desativar' : 'Ativar',
          icon: jogador.isActive ? 'close-circle' : 'checkmark-circle',
          handler: () => this.toggleStatus(jogador)
        },
        {
          text: 'Remover',
          icon: 'trash',
          role: 'destructive',
          handler: () => this.confirmarRemocao(jogador)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async verEstatisticas(jogador: Player) {
    this.router.navigate(['/jogadores/estatisticas', jogador.id]);
  }

  async toggleStatus(jogador: Player) {
    try {
      await this.jogadoresService.atualizarJogador(jogador.id, {
        isActive: !jogador.isActive
      });

      const message = jogador.isActive ? 
        `${jogador.name} foi desativado` : 
        `${jogador.name} foi ativado`;
      
      await this.showToast(message, 'success');
    } catch (error: any) {
      await this.showToast(error.message, 'danger');
    }
  }

  async confirmarRemocao(jogador: Player) {
    const alert = await this.alertController.create({
      header: 'Confirmar Remoção',
      message: `Tem certeza que deseja remover ${jogador.name}? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => this.removerJogador(jogador)
        }
      ]
    });

    await alert.present();
  }

  async removerJogador(jogador: Player) {
    try {
      await this.jogadoresService.removerJogador(jogador.id);
      await this.showToast(`${jogador.name} foi removido`, 'success');
    } catch (error: any) {
      await this.showToast(error.message, 'danger');
    }
  }

  async showFilterOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filtrar por Posição',
      buttons: [
        {
          text: 'Todas as Posições',
          handler: () => {
            this.selectedPosition = 'todas';
            this.applyFilters();
          }
        },
        {
          text: 'Goleiro',
          handler: () => {
            this.selectedPosition = 'Goleiro';
            this.applyFilters();
          }
        },
        {
          text: 'Zagueiro',
          handler: () => {
            this.selectedPosition = 'Zagueiro';
            this.applyFilters();
          }
        },
        {
          text: 'Meio-campo',
          handler: () => {
            this.selectedPosition = 'Meio-campo';
            this.applyFilters();
          }
        },
        {
          text: 'Atacante',
          handler: () => {
            this.selectedPosition = 'Atacante';
            this.applyFilters();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  getPositionColor(position: Position): string {
    const colors = {
      'Goleiro': 'warning',
      'Zagueiro': 'success',
      'Meio-campo': 'primary',
      'Atacante': 'danger'
    };
    return colors[position] || 'medium';
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'success' : 'medium';
  }

  getWinRateColor(winRate: number): string {
    if (winRate >= 70) return 'success';
    if (winRate >= 50) return 'warning';
    return 'danger';
  }

  hasAlert(jogador: Player): boolean {
    return jogador.stats.walkOvers >= 3;
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

