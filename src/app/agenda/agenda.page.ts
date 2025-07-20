import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AgendaService } from './agenda.service';
import { Evento } from './models/evento.model';

interface AlertData {
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
  lembrete: string;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AgendaPage implements OnInit {
  private agendaService = inject(AgendaService);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private router = inject(Router);

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  filtroTipo: string = 'todos';
  dataSelecionada: Date = new Date();
  carregando = false;

  ngOnInit() {
    this.carregarEventos();
  }

  async carregarEventos() {
    this.carregando = true;
    try {
      this.eventos = await this.agendaService.getEventos();
      this.filtrarEventos();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao carregar eventos:', error.message);
      } else {
        console.error('Erro ao carregar eventos:', error);
      }
    } finally {
      this.carregando = false;
    }
  }

  filtrarEventos() {
    if (this.filtroTipo === 'todos') {
      this.eventosFiltrados = this.eventos;
    } else {
      this.eventosFiltrados = this.eventos.filter(evento => evento.tipo === this.filtroTipo);
    }
  }

  async adicionarEvento() {
    const alert = await this.alertController.create({
      header: 'Novo Evento',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          placeholder: 'Título do evento'
        },
        {
          name: 'descricao',
          type: 'textarea',
          placeholder: 'Descrição'
        },
        {
          name: 'data',
          type: 'datetime-local',
          value: new Date().toISOString().slice(0, 16)
        },
        {
          name: 'tipo',
          type: 'text',
          placeholder: 'Tipo (jogo, treino, campeonato, reuniao, outro)',
          value: 'jogo'
        },
        {
          name: 'lembrete',
          type: 'number',
          placeholder: 'Minutos antes do evento',
          value: '30'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: async (data: AlertData) => {
            if (data.titulo && data.data) {
              const novoEvento: Evento = {
                id: Date.now().toString(),
                titulo: data.titulo,
                descricao: data.descricao || '',
                data: new Date(data.data),
                tipo: (data.tipo as Evento['tipo']) || 'outro',
                lembrete: parseInt(data.lembrete) || 30,
                criadoEm: new Date()
              };

              try {
                await this.agendaService.adicionarEvento(novoEvento);
                this.carregarEventos();
              } catch (erro: unknown) {
                console.error('Erro ao adicionar evento:', erro);
                // Aqui você pode exibir um alerta para o usuário, se desejar
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async editarEvento(evento: Evento) {
    const alert = await this.alertController.create({
      header: 'Editar Evento',
      inputs: [
        {
          name: 'titulo',
          type: 'text',
          value: evento.titulo,
          placeholder: 'Título do evento'
        },
        {
          name: 'descricao',
          type: 'textarea',
          value: evento.descricao,
          placeholder: 'Descrição'
        },
        {
          name: 'data',
          type: 'datetime-local',
          value: evento.data.toISOString().slice(0, 16)
        },
        {
          name: 'tipo',
          type: 'text',
          placeholder: 'Tipo (jogo, treino, campeonato, reuniao, outro)',
          value: evento.tipo
        },
        {
          name: 'lembrete',
          type: 'number',
          value: evento.lembrete.toString(),
          placeholder: 'Minutos antes do evento'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: async (data: AlertData) => {
            if (data.titulo && data.data) {
              const eventoEditado: Evento = {
                ...evento,
                titulo: data.titulo,
                descricao: data.descricao || '',
                data: new Date(data.data),
                tipo: (data.tipo as Evento['tipo']) || 'outro',
                lembrete: parseInt(data.lembrete) || 30
              };
              
              await this.agendaService.atualizarEvento(eventoEditado);
              this.carregarEventos();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async excluirEvento(evento: Evento) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: `Deseja realmente excluir o evento "${evento.titulo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            await this.agendaService.excluirEvento(evento.id);
            this.carregarEventos();
          }
        }
      ]
    });

    await alert.present();
  }

  getIconePorTipo(tipo: string): string {
    switch (tipo) {
      case 'jogo': return 'football';
      case 'treino': return 'fitness';
      case 'campeonato': return 'trophy';
      case 'reuniao': return 'people';
      default: return 'calendar';
    }
  }

  getCorPorTipo(tipo: string): string {
    switch (tipo) {
      case 'jogo': return 'primary';
      case 'treino': return 'success';
      case 'campeonato': return 'warning';
      case 'reuniao': return 'secondary';
      default: return 'medium';
    }
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
} 