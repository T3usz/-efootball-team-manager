import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonIcon,
  IonBadge,
  IonButtons,
  IonButton,
  IonSpinner,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart, trophy, person, add, barChart } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamStats } from '../../shared/models/interfaces';
import { Player } from '../../models/players.model';
import { JogadoresService } from '../../services/jogadores.service';
import { EstatisticasService } from '../../services/estatisticas.service';

@Component({
  selector: 'app-estatisticas-gerais',
  templateUrl: 'estatisticas-gerais.page.html',
  styleUrls: ['estatisticas-gerais.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonIcon,
    IonBadge,
    IonButtons,
    IonButton,
    IonSpinner,
    IonSkeletonText
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstatisticasGeraisPage implements OnInit, OnDestroy {
  selectedSegment: string = 'team';
  teamStats: TeamStats | null = null;
  players: Player[] = [];
  Math = Math; // Adicionar Math para uso no template
  isLoading = true; // Começar como true para mostrar loading imediato
  hasInitialData = false; // Flag para controlar se já recebeu dados iniciais

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private jogadoresService: JogadoresService,
    private estatisticasService: EstatisticasService
  ) {
    addIcons({ statsChart, trophy, person, add, barChart });
  }

  ngOnInit() {
    this.loadRealStatistics();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadRealStatistics() {
    // Subscribe to estatisticas state
    this.subscription.add(
      this.estatisticasService.estatisticasState$.subscribe(state => {
        this.isLoading = state.isLoading;
        this.teamStats = state.teamStats;
        
        // Marcar que recebeu dados iniciais
        if (!this.hasInitialData && (state.teamStats || !state.isLoading)) {
          this.hasInitialData = true;
        }
      })
    );

    // Subscribe to jogadores state
    this.subscription.add(
      this.jogadoresService.jogadoresState$.subscribe(state => {
        this.players = state.jogadores;
        
        // Se recebeu jogadores e ainda está carregando, pode parar o loading
        if (this.isLoading && state.jogadores.length > 0 && this.hasInitialData) {
          this.isLoading = false;
        }
        
        // Se não há jogadores e não está carregando, parar o loading
        if (state.jogadores.length === 0 && !state.isLoading && !state.error) {
          this.isLoading = false;
        }
      })
    );
  }



  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  registerResult() {
    this.router.navigate(['/agenda/registrar-resultado']);
  }

  viewPlayerDetails(player: Player) {
    this.router.navigate(['/jogadores/detalhe', player.id]);
  }

  getBadgeColor(winRate: number): string {
    if (winRate >= 80) return 'success';
    if (winRate >= 60) return 'warning';
    return 'danger';
  }

  getPositionLabel(position: string): string {
    const labels: Record<string, string> = {
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

  getStrokeDasharray(): string {
    if (!this.teamStats) return '0, 339.292';
    const circumference = 2 * Math.PI * 54; // r = 54
    const progress = (this.teamStats.winRate / 100) * circumference;
    return `${progress}, ${circumference}`;
  }

  getCircleColor(): string {
    if (!this.teamStats) return '#6c5ce7';
    const winRate = this.teamStats.winRate;
    
    if (winRate >= 80) return '#00d2c1'; // success
    if (winRate >= 60) return '#ffa726'; // warning
    if (winRate >= 40) return '#6c5ce7'; // primary
    return '#d63031'; // danger
  }
}

