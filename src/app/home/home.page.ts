import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, 
  people, 
  statsChart, 
  trophy, 
  calendar, 
  cloudDownload, 
  settings, 
  personCircle,
  create,
  removeOutline,
  closeOutline,
  banOutline,
  refreshOutline,
  notificationsOutline,
  trendingUpOutline,
  trendingDownOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Team, TeamStats, Alert, StatsSummary } from '../shared/models/interfaces';
import { CardEstatisticaComponent } from '../shared/components/card-estatistica.component';
import { GraficoAproveitamentoComponent } from '../shared/components/grafico-aproveitamento.component';
import { AlertCardComponent } from '../shared/components/alert-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    CardEstatisticaComponent,
    GraficoAproveitamentoComponent,
    AlertCardComponent
  ],
})
export class HomePage implements OnInit {
  private router = inject(Router);
  
  team: Team | null = null;
  statsSummary: StatsSummary | null = null;
  alerts: Alert[] = [];
  isLoading = true;
  
  actions = [
    { icon: 'people', label: 'Jogadores', route: '/tabs/jogadores', color: 'primary' },
    { icon: 'stats-chart', label: 'Estatísticas', route: '/tabs/estatisticas', color: 'success' },
    { icon: 'trophy', label: 'Ranking', route: '/ranking', color: 'warning' },
    { icon: 'calendar', label: 'Agenda', route: '/agenda', color: 'tertiary' },
    { icon: 'cloud-download', label: 'Backup', route: '/backup', color: 'medium' },
    { icon: 'settings', label: 'Configurações', route: '/configuracoes', color: 'dark' }
  ];

  constructor() {
    addIcons({ 
      home, 
      people, 
      statsChart, 
      trophy, 
      calendar, 
      cloudDownload, 
      settings, 
      personCircle,
      create,
      removeOutline,
      closeOutline,
      banOutline,
      refreshOutline,
      notificationsOutline,
      trendingUpOutline,
      trendingDownOutline
    });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoading = true;
    
    try {
      // Simulate API calls - will be replaced with actual Firebase services
      await this.loadTeamData();
      await this.loadStatsSummary();
      await this.loadAlerts();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadTeamData() {
    // Mock data - will be replaced with Firebase service
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.team = {
      id: 'team-1',
      name: 'Team eFootball Pro',
      adminId: 'admin-1',
      adminName: 'João Silva',
      modality: 'eFootball',
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalMatches: 28,
        victories: 20,
        draws: 5,
        defeats: 2,
        walkOvers: 1,
        winRate: 71.4
      }
    };
  }

  async loadStatsSummary() {
    // Mock data - will be replaced with Firebase service
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.statsSummary = {
      team: this.team!.stats,
      topPlayer: {
        id: '1',
        name: 'Carlos Silva',
        nickname: 'CarlosGamer',
        age: 22,
        position: 'Atacante',
        observations: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalMatches: 18,
          victories: 15,
          draws: 2,
          defeats: 1,
          walkOvers: 0,
          winRate: 83.3
        }
      },
      recentMatches: [],
      upcomingSchedule: [],
      alerts: []
    };
  }

  async loadAlerts() {
    // Mock data - will be replaced with Firebase service
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.alerts = [
      {
        id: 'alert-1',
        type: 'walkover_warning',
        title: 'Alerta de W.O',
        message: 'Ana Costa atingiu 3 W.O consecutivos. Considere conversar com a jogadora.',
        playerId: '2',
        playerName: 'Ana Costa',
        severity: 'high',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        dismissed: false
      },
      {
        id: 'alert-2',
        type: 'performance_alert',
        title: 'Queda de Performance',
        message: 'O time teve 3 derrotas nas últimas 5 partidas.',
        severity: 'medium',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        dismissed: false
      }
    ];
  }

  async doRefresh(event: any) {
    await this.loadDashboardData();
    event.target.complete();
  }

  openProfile() {
    // Navigate to profile or show profile modal
    console.log('Open profile');
  }

  editTeam() {
    this.router.navigate(['/team/cadastro-time']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onAlertDismiss(alert: Alert) {
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
    // TODO: Update alert status in Firebase
  }

  onAlertAction(alert: Alert) {
    if (alert.type === 'walkover_warning' && alert.playerId) {
      this.router.navigate(['/jogadores/detalhe', alert.playerId]);
    } else if (alert.type === 'performance_alert') {
      this.router.navigate(['/tabs/estatisticas']);
    }
  }

  getQuickStats() {
    if (!this.team?.stats) return [];
    
    const stats = this.team.stats;
    return [
      {
        icon: 'trophy',
        value: stats.victories,
        label: 'Vitórias',
        color: 'success',
        trend: { direction: 'up' as const, value: 12 }
      },
      {
        icon: 'remove-outline',
        value: stats.draws,
        label: 'Empates',
        color: 'warning'
      },
      {
        icon: 'close-outline',
        value: stats.defeats,
        label: 'Derrotas',
        color: 'danger',
        trend: { direction: 'down' as const, value: 8 }
      },
      {
        icon: 'ban-outline',
        value: stats.walkOvers,
        label: 'W.O',
        color: 'dark'
      }
    ];
  }

  hasAlerts(): boolean {
    return this.alerts.filter(alert => !alert.dismissed).length > 0;
  }
}

