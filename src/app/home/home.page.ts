import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  trendingDownOutline,
  person,
  warning,
  warningOutline,
  informationCircle,
  informationCircleOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  alertCircle,
  alertCircleOutline,
  addCircle,
  cloudDownloadOutline,
  calendarOutline,
  trophyOutline,
  statsChartOutline,
  peopleOutline,
  settingsOutline,
  personCircleOutline,
  createOutline,
  removeCircle,
  closeCircle,
  refreshCircle,
  notificationsCircle,
  trendingUp,
  trendingDown
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team, TeamStats, Alert, StatsSummary } from '../shared/models/interfaces';
import { Player } from '../models/players.model';
import { CardEstatisticaComponent } from '../shared/components/card-estatistica.component';
import { AlertCardComponent } from '../shared/components/alert-card.component';
import { EstatisticasService } from '../services/estatisticas.service';
import { JogadoresService } from '../services/jogadores.service';

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
    IonSkeletonText,
    CardEstatisticaComponent,
    AlertCardComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private estatisticasService = inject(EstatisticasService);
  private jogadoresService = inject(JogadoresService);
  
  team: Team | null = null;
  statsSummary: StatsSummary | null = null;
  alerts: Alert[] = [];
  isLoading = true;
  
  actions = [
    { icon: 'people', label: 'Jogadores', description: 'Gerenciar jogadores', route: '/tabs/jogadores', color: 'primary' },
    { icon: 'stats-chart', label: 'Estatísticas', description: 'Ver estatísticas', route: '/tabs/estatisticas', color: 'success' },
    { icon: 'trophy', label: 'Ranking', description: 'Ver ranking', route: '/ranking', color: 'warning' },
    { icon: 'calendar', label: 'Agenda', description: 'Gerenciar agenda', route: '/agenda', color: 'tertiary' },
    { icon: 'cloud-download', label: 'Backup', description: 'Fazer backup', route: '/backup', color: 'medium' },
    { icon: 'add-circle', label: 'Registrar Resultado', description: 'Registrar resultado', route: '/agenda/registrar-resultado', color: 'secondary' }
  ];

  private subscription = new Subscription();

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
      trendingDownOutline,
      person,
      warning,
      warningOutline,
      informationCircle,
      informationCircleOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      alertCircle,
      alertCircleOutline,
      addCircle,
      cloudDownloadOutline,
      calendarOutline,
      trophyOutline,
      statsChartOutline,
      peopleOutline,
      settingsOutline,
      personCircleOutline,
      createOutline,
      removeCircle,
      closeCircle,
      refreshCircle,
      notificationsCircle,
      trendingUp,
      trendingDown
    });
  }

  ngOnInit() {
    this.loadRealData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadRealData() {
    // Subscribe to estatisticas state
    this.subscription.add(
      this.estatisticasService.estatisticasState$.subscribe(state => {
        this.isLoading = state.isLoading;
        
        if (state.teamStats) {
          this.statsSummary = this.estatisticasService.getStatsSummary();
        }
        
        this.alerts = state.alerts;
      })
    );

    // Subscribe to jogadores state for team info
    this.subscription.add(
      this.jogadoresService.jogadoresState$.subscribe(state => {
        if (state.jogadores.length > 0) {
          // Create team info based on jogadores data
          this.team = {
            id: '1',
            name: 'Time Principal',
            adminId: 'admin-1',
            adminName: 'Administrador',
            modality: 'Futebol',
            createdAt: new Date(),
            updatedAt: new Date(),
            stats: this.estatisticasService.teamStats || {
              victories: 0,
              draws: 0,
              defeats: 0,
              walkOvers: 0,
              totalMatches: 0,
              winRate: 0
            }
          };
        }
      })
    );
  }

  hasAlerts(): boolean {
    return this.alerts.length > 0;
  }

  getQuickStats() {
    return this.estatisticasService.getQuickStats();
  }

  editTeam() {
    // TODO: Implement team editing
    console.log('Edit team');
  }

  openProfile() {
    // TODO: Implement profile
    console.log('Open profile');
  }

  onAlertDismiss(alert: Alert) {
    // TODO: Implement alert dismissal
    console.log('Dismiss alert:', alert.id);
  }

  onAlertAction(alert: Alert) {
    // TODO: Implement alert action
    console.log('Alert action:', alert.id);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

