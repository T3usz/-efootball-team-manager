import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  warningOutline, 
  informationCircleOutline, 
  checkmarkCircleOutline, 
  alertCircleOutline,
  closeOutline,
  chevronForwardOutline,
  warning,
  informationCircle,
  checkmarkCircle,
  alertCircle
} from 'ionicons/icons';
import { Alert, AlertSeverity, AlertType } from '../models/interfaces';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon, IonButton],
  template: `
    <ion-card [class]="'alert-card alert-' + alert.severity" *ngIf="!alert.dismissed">
      <ion-card-content>
        <div class="alert-container">
          <div class="alert-icon-wrapper">
            <ion-icon [name]="getAlertIcon()" class="alert-icon"></ion-icon>
          </div>
          
          <div class="alert-content">
            <h3 class="alert-title">{{ alert.title }}</h3>
            <p class="alert-message">{{ alert.message }}</p>
            <div *ngIf="alert.playerId" class="alert-player">
              <span class="player-label">Jogador:</span>
              <span class="player-name">{{ alert.playerName }}</span>
            </div>
            <div class="alert-time">
              {{ getTimeAgo() }}
            </div>
          </div>
          
          <div class="alert-actions">
            <ion-button 
              fill="clear" 
              size="small" 
              (click)="onDismiss()"
              class="dismiss-button">
              <ion-icon name="close-outline" slot="icon-only"></ion-icon>
            </ion-button>
            
            <ion-button 
              *ngIf="showActionButton()"
              fill="clear" 
              size="small" 
              (click)="onAction()"
              class="action-button">
              <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
            </ion-button>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .alert-card {
      margin: 8px 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      
      &.alert-low {
        border-left-color: var(--ion-color-primary);
        --background: #f8f9ff;
      }
      
      &.alert-medium {
        border-left-color: var(--ion-color-warning);
        --background: #fffbf0;
      }
      
      &.alert-high {
        border-left-color: var(--ion-color-danger);
        --background: #fff5f5;
      }
    }
    
    ion-card-content {
      padding: 16px;
    }
    
    .alert-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .alert-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .alert-icon {
        font-size: 20px;
      }
    }
    
    .alert-low .alert-icon-wrapper {
      background: rgba(var(--ion-color-primary-rgb), 0.1);
      
      .alert-icon {
        color: var(--ion-color-primary);
      }
    }
    
    .alert-medium .alert-icon-wrapper {
      background: rgba(var(--ion-color-warning-rgb), 0.1);
      
      .alert-icon {
        color: var(--ion-color-warning);
      }
    }
    
    .alert-high .alert-icon-wrapper {
      background: rgba(var(--ion-color-danger-rgb), 0.1);
      
      .alert-icon {
        color: var(--ion-color-danger);
      }
    }
    
    .alert-content {
      flex: 1;
      min-width: 0;
    }
    
    .alert-title {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--ion-color-dark);
      line-height: 1.2;
    }
    
    .alert-message {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: var(--ion-color-medium);
      line-height: 1.4;
    }
    
    .alert-player {
      margin-bottom: 8px;
      
      .player-label {
        font-size: 12px;
        color: var(--ion-color-medium);
        font-weight: 500;
      }
      
      .player-name {
        font-size: 12px;
        color: var(--ion-color-dark);
        font-weight: 600;
        margin-left: 4px;
      }
    }
    
    .alert-time {
      font-size: 11px;
      color: var(--ion-color-light);
      font-weight: 500;
    }
    
    .alert-actions {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      ion-button {
        --padding-start: 8px;
        --padding-end: 8px;
        --padding-top: 8px;
        --padding-bottom: 8px;
        width: 32px;
        height: 32px;
        
        ion-icon {
          font-size: 16px;
        }
      }
      
      .dismiss-button {
        --color: var(--ion-color-medium);
        
        &:hover {
          --color: var(--ion-color-danger);
        }
      }
      
      .action-button {
        --color: var(--ion-color-primary);
      }
    }
    
    // Animation for dismissal
    .alert-card {
      transition: all 0.3s ease;
      
      &.dismissed {
        opacity: 0;
        transform: translateX(100%);
        margin-right: -100%;
      }
    }
  `]
})
export class AlertCardComponent {
  @Input() alert!: Alert;
  @Output() dismiss = new EventEmitter<Alert>();
  @Output() action = new EventEmitter<Alert>();

  constructor() {
    addIcons({ 
      warningOutline, 
      informationCircleOutline, 
      checkmarkCircleOutline, 
      alertCircleOutline,
      closeOutline,
      chevronForwardOutline,
      warning,
      informationCircle,
      checkmarkCircle,
      alertCircle
    });
  }

  getAlertIcon(): string {
    switch (this.alert.type) {
      case 'walkover_warning':
        return 'warning-outline';
      case 'performance_alert':
        return 'alert-circle-outline';
      case 'schedule_reminder':
        return 'information-circle-outline';
      default:
        return 'information-circle-outline';
    }
  }

  showActionButton(): boolean {
    // Show action button for certain alert types
    return this.alert.type === 'walkover_warning' || this.alert.type === 'performance_alert';
  }

  onDismiss() {
    this.dismiss.emit(this.alert);
  }

  onAction() {
    this.action.emit(this.alert);
  }

  getTimeAgo(): string {
    const now = new Date();
    const alertTime = new Date(this.alert.createdAt);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  }
}

