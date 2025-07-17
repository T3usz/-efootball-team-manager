import { Component, OnInit } from '@angular/core';
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
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { statsChart, trophy, person, add, barChart } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Player, TeamStats } from '../../shared/models/interfaces';

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
    IonButton
  ],
})
export class EstatisticasGeraisPage implements OnInit {
  selectedSegment: string = 'team';
  teamStats: TeamStats | null = null;
  players: Player[] = [];

  constructor(private router: Router) {
    addIcons({ statsChart, trophy, person, add, barChart });
  }

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    // Mock data
    this.teamStats = {
      totalMatches: 25,
      victories: 18,
      draws: 4,
      defeats: 2,
      walkOvers: 1,
      winRate: 72.0
    };

    this.players = [
      {
        id: '1',
        name: 'Carlos Silva',
        nickname: 'CarlosGamer',
        age: 22,
        position: 'Atacante',
        observations: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalMatches: 15,
          victories: 12,
          draws: 2,
          defeats: 1,
          walkOvers: 0,
          winRate: 80.0
        }
      },
      {
        id: '2',
        name: 'Ana Costa',
        nickname: 'AnaFoot',
        age: 19,
        position: 'Meio-campo',
        observations: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          totalMatches: 10,
          victories: 7,
          draws: 2,
          defeats: 1,
          walkOvers: 0,
          winRate: 70.0
        }
      }
    ];
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  registerResult() {
    this.router.navigate(['/estatisticas/registrar']);
  }

  viewPlayerDetails(player: Player) {
    this.router.navigate(['/jogadores/detalhe', player.id]);
  }

  getBadgeColor(winRate: number): string {
    if (winRate >= 80) return 'success';
    if (winRate >= 60) return 'warning';
    return 'danger';
  }
}

