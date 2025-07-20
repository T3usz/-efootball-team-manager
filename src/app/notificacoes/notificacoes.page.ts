import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  notifications,
  notificationsOutline,
  checkmarkCircle,
  warning,
  informationCircle,
  trash,
  eye,
  eyeOff
} from 'ionicons/icons';
import { Alert, AlertType, AlertSeverity } from '../shared/models/interfaces';
import { EstatisticasService } from '../services/estatisticas.service';
import { AlertCardComponent } from '../shared/components/alert-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButtons,
    IonButton,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    AlertCardComponent
  ]
})
export class NotificacoesPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private estatisticasService = inject(EstatisticasService);

  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  selectedFilter: 'all' | 'unread' | 'read' = 'all';
  isLoading = false;

  private subscription = new Subscription();

  constructor() {
    addIcons({ 
      arrowBack,
      notifications,
      notificationsOutline,
      checkmarkCircle,
      warning,
      informationCircle,
      trash,
      eye,
      eyeOff
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadNotifications() {
    this.subscription.add(
      this.estatisticasService.estatisticasState$.subscribe(state => {
        this.alerts = state.alerts;
        this.applyFilter();
      })
    );
  }

  onSegmentChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

  private applyFilter() {
    switch (this.selectedFilter) {
      case 'unread':
        this.filteredAlerts = this.alerts.filter(alert => !alert.dismissed);
        break;
      case 'read':
        this.filteredAlerts = this.alerts.filter(alert => alert.dismissed);
        break;
      default:
        this.filteredAlerts = this.alerts;
    }
  }

  onAlertDismiss(alert: Alert) {
    // Marcar como lida
    alert.dismissed = true;
    this.estatisticasService.dismissAlert(alert.id);
    this.applyFilter();
  }

  onAlertAction(alert: Alert) {
    // Navegar para a página relacionada ao alerta
    switch (alert.type) {
      case 'walkover_warning':
        this.router.navigate(['/tabs/jogadores']);
        break;
      case 'performance_alert':
        this.router.navigate(['/tabs/estatisticas']);
        break;
      case 'schedule_reminder':
        this.router.navigate(['/agenda']);
        break;
      default:
        console.log('Alert action:', alert.id);
    }
  }

  markAllAsRead() {
    this.alerts.forEach(alert => {
      alert.dismissed = true;
      this.estatisticasService.dismissAlert(alert.id);
    });
    this.applyFilter();
  }

  clearAllRead() {
    // Remover alertas lidos
    this.alerts = this.alerts.filter(alert => !alert.dismissed);
    this.applyFilter();
  }

  doRefresh(event: any) {
    // Recarregar notificações
    this.loadNotifications();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getUnreadCount(): number {
    return this.alerts.filter(alert => !alert.dismissed).length;
  }

  getDismissedCount(): number {
    return this.alerts.filter(alert => alert.dismissed).length;
  }

  getAlertIcon(type: AlertType): string {
    switch (type) {
      case 'walkover_warning':
        return 'warning';
      case 'performance_alert':
        return 'information-circle';
      case 'schedule_reminder':
        return 'notifications';
      default:
        return 'notifications';
    }
  }

  getAlertColor(severity: AlertSeverity): string {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'primary';
      default:
        return 'medium';
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
} 