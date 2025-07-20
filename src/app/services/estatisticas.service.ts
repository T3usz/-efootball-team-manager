import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { TeamStats, StatsSummary, Alert } from '../shared/models/interfaces';
import { Player } from '../models/players.model';
import { JogadoresService } from './jogadores.service';
import { AuthService } from './auth.service';

export interface EstatisticasState {
  teamStats: TeamStats | null;
  topPlayer: Player | null;
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EstatisticasService {
  private firestore = inject(Firestore);
  private jogadoresService = inject(JogadoresService);
  private authService = inject(AuthService);

  // Reactive state management
  private estatisticasState = signal<EstatisticasState>({
    teamStats: null,
    topPlayer: null,
    alerts: [],
    isLoading: false,
    error: null
  });

  private estatisticasStateSubject = new BehaviorSubject<EstatisticasState>(this.estatisticasState());
  public estatisticasState$ = this.estatisticasStateSubject.asObservable();

  private unsubscribe: Unsubscribe | null = null;

  constructor() {
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(authState => {
      if (authState.isAuthenticated && authState.appUser) {
        this.initializeEstatisticasListener(authState.appUser.id);
      } else {
        this.clearEstatisticas();
      }
    });
  }

  private updateEstatisticasState(newState: Partial<EstatisticasState>) {
    const currentState = this.estatisticasState();
    const updatedState = { ...currentState, ...newState };
    this.estatisticasState.set(updatedState);
    this.estatisticasStateSubject.next(updatedState);
  }

  private initializeEstatisticasListener(userId: string) {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.updateEstatisticasState({ isLoading: true, error: null });

    // Subscribe to jogadores changes to recalculate stats
    this.jogadoresService.jogadoresState$.subscribe(jogadoresState => {
      if (jogadoresState.jogadores.length > 0) {
        this.calculateTeamStats(jogadoresState.jogadores);
        this.findTopPlayer(jogadoresState.jogadores);
        this.generateAlerts(jogadoresState.jogadores);
      } else {
        this.updateEstatisticasState({
          teamStats: this.getDefaultTeamStats(),
          topPlayer: null,
          alerts: [],
          isLoading: false,
          error: null
        });
      }
    });
  }

  private calculateTeamStats(jogadores: Player[]) {
    const jogadoresAtivos = jogadores.filter(j => j.isActive);
    
    if (jogadoresAtivos.length === 0) {
      this.updateEstatisticasState({
        teamStats: this.getDefaultTeamStats(),
        isLoading: false
      });
      return;
    }

    const teamStats = jogadoresAtivos.reduce((acc, jogador) => ({
      victories: acc.victories + jogador.stats.victories,
      draws: acc.draws + jogador.stats.draws,
      defeats: acc.defeats + jogador.stats.defeats,
      walkOvers: acc.walkOvers + jogador.stats.walkOvers,
      totalMatches: acc.totalMatches + jogador.stats.totalMatches
    }), { victories: 0, draws: 0, defeats: 0, walkOvers: 0, totalMatches: 0 });

    const winRate = teamStats.totalMatches > 0 
      ? Math.round((teamStats.victories / teamStats.totalMatches) * 100) 
      : 0;

    this.updateEstatisticasState({
      teamStats: { ...teamStats, winRate },
      isLoading: false
    });
  }

  private findTopPlayer(jogadores: Player[]) {
    const jogadoresAtivos = jogadores.filter(j => j.isActive && j.stats.totalMatches > 0);
    
    if (jogadoresAtivos.length === 0) {
      this.updateEstatisticasState({ topPlayer: null });
      return;
    }

    const topPlayer = jogadoresAtivos.reduce((melhor, atual) => {
      if (atual.stats.winRate > melhor.stats.winRate) return atual;
      if (atual.stats.winRate === melhor.stats.winRate && atual.stats.totalMatches > melhor.stats.totalMatches) return atual;
      return melhor;
    });

    this.updateEstatisticasState({ topPlayer });
  }

  private generateAlerts(jogadores: Player[]) {
    const alerts: Alert[] = [];

    // Check for walkover warnings
    jogadores.forEach(jogador => {
      if (jogador.stats.walkOvers >= 3) {
        alerts.push({
          id: `wo-${jogador.id}`,
          type: 'walkover_warning',
          title: 'W.O Consecutivo',
          message: `${jogador.name} tem ${jogador.stats.walkOvers} W.O consecutivos`,
          playerId: jogador.id,
          severity: 'medium',
          createdAt: new Date(),
          dismissed: false
        });
      }
    });

    // Check for performance drops
    const jogadoresAtivos = jogadores.filter(j => j.isActive);
    if (jogadoresAtivos.length > 0) {
      const avgWinRate = jogadoresAtivos.reduce((sum, j) => sum + j.stats.winRate, 0) / jogadoresAtivos.length;
      
      if (avgWinRate < 50) {
        alerts.push({
          id: 'perf-drop',
          type: 'performance_alert',
          title: 'Queda de Performance',
          message: `Time teve queda de ${Math.round(100 - avgWinRate)}% no aproveitamento`,
          severity: 'high',
          createdAt: new Date(),
          dismissed: false
        });
      }
    }

    this.updateEstatisticasState({ alerts });
  }

  private getDefaultTeamStats(): TeamStats {
    return {
      victories: 0,
      draws: 0,
      defeats: 0,
      walkOvers: 0,
      totalMatches: 0,
      winRate: 0
    };
  }

  private clearEstatisticas() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.updateEstatisticasState({
      teamStats: null,
      topPlayer: null,
      alerts: [],
      isLoading: false,
      error: null
    });
  }

  // Getters for reactive state
  get teamStats(): TeamStats | null {
    return this.estatisticasState().teamStats;
  }

  get topPlayer(): Player | null {
    return this.estatisticasState().topPlayer;
  }

  get alerts(): Alert[] {
    return this.estatisticasState().alerts;
  }

  get isLoading(): boolean {
    return this.estatisticasState().isLoading;
  }

  get error(): string | null {
    return this.estatisticasState().error;
  }

  // Public methods
  getStatsSummary(): StatsSummary {
    return {
      team: this.teamStats || this.getDefaultTeamStats(),
      topPlayer: this.topPlayer as any, // Temporary fix for type compatibility
      recentMatches: [],
      upcomingSchedule: [],
      alerts: this.alerts
    };
  }

  hasAlerts(): boolean {
    return this.alerts.length > 0;
  }

  getQuickStats() {
    const jogadores = this.jogadoresService.jogadores;
    const jogadoresAtivos = this.jogadoresService.getJogadoresAtivos();
    const totalJogadores = jogadores.length;
    const totalAtivos = jogadoresAtivos.length;
    const jogadoresComAlerta = this.jogadoresService.getJogadoresComAlerta().length;

    return [
      {
        icon: 'people',
        value: totalJogadores.toString(),
        label: 'Total',
        color: 'primary'
      },
      {
        icon: 'checkmark-circle',
        value: totalAtivos.toString(),
        label: 'Ativos',
        color: 'success'
      },
      {
        icon: 'warning',
        value: jogadoresComAlerta.toString(),
        label: 'Alertas',
        color: 'warning'
      }
    ];
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  dismissAlert(alertId: string): void {
    const currentState = this.estatisticasState();
    const updatedAlerts = currentState.alerts.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    );
    
    this.updateEstatisticasState({ alerts: updatedAlerts });
  }
} 