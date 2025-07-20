import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trophy, 
  removeOutline, 
  closeOutline, 
  banOutline,
  statsChart,
  people,
  calendar,
  checkmarkCircle,
  arrowUp,
  arrowDown
} from 'ionicons/icons';

@Component({
  selector: 'app-card-estatistica',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon],
  template: `
    <ion-card [class]="'stat-card ' + color" (click)="onClick()" [class.clickable]="clickable">
      <ion-card-content>
        <div class="stat-container">
          <div class="stat-icon-wrapper">
            <ion-icon [name]="icon" class="stat-icon"></ion-icon>
          </div>
          <div class="stat-info">
            <h2 class="stat-value">{{ value }}</h2>
            <p class="stat-label">{{ label }}</p>
            <p *ngIf="subtitle" class="stat-subtitle">{{ subtitle }}</p>
          </div>
          <div *ngIf="trend" class="stat-trend" [class]="'trend-' + trend.direction">
            <ion-icon [name]="getTrendIcon()" class="trend-icon"></ion-icon>
            <span class="trend-value">{{ trend.value }}%</span>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .stat-card {
      margin: 8px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
      }
      
      &.success {
        --background: linear-gradient(135deg, #10dc60, #16ba52);
        color: white;
      }
      
      &.warning {
        --background: linear-gradient(135deg, #ffce00, #f4a100);
        color: white;
      }
      
      &.danger {
        --background: linear-gradient(135deg, #f04141, #d33939);
        color: white;
      }
      
      &.dark {
        --background: linear-gradient(135deg, #222428, #383a3e);
        color: white;
      }
      
      &.primary {
        --background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-primary-shade));
        color: white;
      }
      
      &.light {
        --background: white;
        color: var(--ion-color-dark);
        border: 1px solid #e0e0e0;
      }
      
      &.clickable {
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
    
    ion-card-content {
      padding: 20px;
    }
    
    // Responsividade para mobile
    @media (max-width: 768px) {
      ion-card-content {
        padding: 16px;
      }
      
      .stat-value {
        font-size: 18px;
      }
      
      .stat-label {
        font-size: 10px;
      }
      
      .stat-icon {
        font-size: 18px;
      }
      
      .stat-icon-wrapper {
        width: 36px;
        height: 36px;
        margin-right: 10px;
      }
    }
    
    @media (max-width: 480px) {
      ion-card-content {
        padding: 10px;
      }
      
      .stat-value {
        font-size: 16px;
      }
      
      .stat-label {
        font-size: 9px;
      }
      
      .stat-icon {
        font-size: 16px;
      }
      
      .stat-icon-wrapper {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    }
    
    .stat-container {
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .stat-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .stat-icon {
      font-size: 20px;
      opacity: 0.9;
    }
    
    .stat-info {
      flex: 1;
    }
    
    .stat-value {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
    }
    
    .stat-label {
      margin: 0 0 2px 0;
      font-size: 12px;
      opacity: 0.9;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-subtitle {
      margin: 0;
      font-size: 12px;
      opacity: 0.7;
      font-weight: 400;
    }
    
    .stat-trend {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      
      &.trend-up {
        background: rgba(16, 220, 96, 0.3);
      }
      
      &.trend-down {
        background: rgba(240, 65, 65, 0.3);
      }
      
      .trend-icon {
        font-size: 12px;
      }
      
      .trend-value {
        font-size: 11px;
        font-weight: 600;
      }
    }
    
    // Light theme adjustments
    .stat-card.light {
      .stat-icon-wrapper {
        background: var(--ion-color-primary);
        
        .stat-icon {
          color: white;
        }
      }
      
      .stat-trend {
        background: #f5f5f5;
        color: var(--ion-color-dark);
        
        &.trend-up {
          background: rgba(16, 220, 96, 0.1);
          color: var(--ion-color-success);
        }
        
        &.trend-down {
          background: rgba(240, 65, 65, 0.1);
          color: var(--ion-color-danger);
        }
      }
    }
  `]
})
export class CardEstatisticaComponent {
  @Input() icon: string = 'stats-chart';
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() subtitle?: string;
  @Input() color: string = 'primary';
  @Input() clickable: boolean = false;
  @Input() trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
  @Output() cardClick = new EventEmitter<void>();

  constructor() {
    addIcons({ 
      trophy, 
      removeOutline, 
      closeOutline, 
      banOutline,
      statsChart,
      people,
      calendar,
      checkmarkCircle,
      arrowUp,
      arrowDown
    });
  }

  getTrendIcon(): string {
    if (!this.trend) return '';
    
    switch (this.trend.direction) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      default: return 'remove';
    }
  }

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}

