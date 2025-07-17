import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { TeamStats, PlayerStats } from '../models/interfaces';

@Component({
  selector: 'app-grafico-aproveitamento',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle],
  template: `
    <ion-card class="performance-chart-card">
      <ion-card-header>
        <ion-card-title>{{ title || 'Aproveitamento' }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div class="chart-container">
          <!-- Gráfico Circular -->
          <div class="circular-chart">
            <svg viewBox="0 0 36 36" class="circular-chart-svg">
              <!-- Background circle -->
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                stroke-width="3"/>
              
              <!-- Progress circle -->
              <path class="circle"
                [attr.stroke-dasharray]="getStrokeDasharray()"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                [attr.stroke]="getCircleColor()"
                stroke-width="3"
                stroke-linecap="round"/>
              
              <!-- Percentage text -->
              <text x="18" y="20.35" class="percentage">{{ getWinRate() }}%</text>
            </svg>
            
            <!-- Center info -->
            <div class="chart-center-info">
              <div class="win-rate">{{ getWinRate() }}%</div>
              <div class="win-rate-label">Aproveitamento</div>
            </div>
          </div>
          
          <!-- Detalhes das estatísticas -->
          <div class="stats-breakdown">
            <div class="breakdown-item victories">
              <div class="breakdown-dot"></div>
              <span class="breakdown-label">Vitórias</span>
              <span class="breakdown-value">{{ stats?.victories || 0 }}</span>
            </div>
            
            <div class="breakdown-item draws">
              <div class="breakdown-dot"></div>
              <span class="breakdown-label">Empates</span>
              <span class="breakdown-value">{{ stats?.draws || 0 }}</span>
            </div>
            
            <div class="breakdown-item defeats">
              <div class="breakdown-dot"></div>
              <span class="breakdown-label">Derrotas</span>
              <span class="breakdown-value">{{ stats?.defeats || 0 }}</span>
            </div>
            
            <div class="breakdown-item walkovers">
              <div class="breakdown-dot"></div>
              <span class="breakdown-label">W.O</span>
              <span class="breakdown-value">{{ stats?.walkOvers || 0 }}</span>
            </div>
            
            <div class="breakdown-total">
              <span class="total-label">Total de Partidas</span>
              <span class="total-value">{{ stats?.totalMatches || 0 }}</span>
            </div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .performance-chart-card {
      margin: 16px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    ion-card-header {
      padding-bottom: 8px;
      
      ion-card-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--ion-color-primary);
      }
    }
    
    .chart-container {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .circular-chart {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }
    
    .circular-chart-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .circle-bg {
      stroke: #f0f0f0;
    }
    
    .circle {
      transition: stroke-dasharray 0.6s ease-in-out;
    }
    
    .percentage {
      fill: var(--ion-color-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.5em;
      font-weight: 700;
      text-anchor: middle;
      transform: rotate(90deg) translate(0, -0.1em);
      transform-origin: 18px 20.35px;
    }
    
    .chart-center-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    }
    
    .win-rate {
      font-size: 24px;
      font-weight: 700;
      color: var(--ion-color-primary);
      line-height: 1;
    }
    
    .win-rate-label {
      font-size: 10px;
      color: var(--ion-color-medium);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    
    .stats-breakdown {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .breakdown-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .breakdown-label {
        flex: 1;
        font-size: 14px;
        color: var(--ion-color-medium);
        font-weight: 500;
      }
      
      .breakdown-value {
        font-size: 16px;
        font-weight: 600;
        color: var(--ion-color-dark);
        min-width: 24px;
        text-align: right;
      }
      
      &.victories .breakdown-dot {
        background: var(--ion-color-success);
      }
      
      &.draws .breakdown-dot {
        background: var(--ion-color-warning);
      }
      
      &.defeats .breakdown-dot {
        background: var(--ion-color-danger);
      }
      
      &.walkovers .breakdown-dot {
        background: var(--ion-color-dark);
      }
    }
    
    .breakdown-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
      margin-top: 8px;
      
      .total-label {
        font-size: 14px;
        color: var(--ion-color-dark);
        font-weight: 600;
      }
      
      .total-value {
        font-size: 18px;
        font-weight: 700;
        color: var(--ion-color-primary);
      }
    }
    
    // Responsive adjustments
    @media (max-width: 576px) {
      .chart-container {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .circular-chart {
        align-self: center;
      }
      
      .stats-breakdown {
        width: 100%;
      }
    }
  `]
})
export class GraficoAproveitamentoComponent implements OnInit, OnChanges {
  @Input() stats: TeamStats | PlayerStats | null = null;
  @Input() title?: string;

  ngOnInit() {
    // Component initialization
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stats']) {
      // Handle stats changes if needed
    }
  }

  getWinRate(): number {
    return Math.round(this.stats?.winRate || 0);
  }

  getStrokeDasharray(): string {
    const winRate = this.getWinRate();
    const circumference = 100;
    const progress = (winRate / 100) * circumference;
    return `${progress}, ${circumference}`;
  }

  getCircleColor(): string {
    const winRate = this.getWinRate();
    
    if (winRate >= 80) {
      return 'var(--ion-color-success)';
    } else if (winRate >= 60) {
      return 'var(--ion-color-warning)';
    } else if (winRate >= 40) {
      return 'var(--ion-color-primary)';
    } else {
      return 'var(--ion-color-danger)';
    }
  }
}

