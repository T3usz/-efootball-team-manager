import { Injectable, signal } from '@angular/core';
import { Evento } from './models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private eventosSignal = signal<Evento[]>([]);
  private readonly STORAGE_KEY = 'agenda_eventos';

  constructor() {
    this.carregarEventos();
  }

  private carregarEventos() {
    try {
      const eventosSalvos = localStorage.getItem(this.STORAGE_KEY);
      if (eventosSalvos) {
        const eventos = JSON.parse(eventosSalvos).map((evento: any) => ({
          ...evento,
          data: new Date(evento.data),
          criadoEm: new Date(evento.criadoEm)
        }));
        this.eventosSignal.set(eventos);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  }

  private salvarEventos() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.eventosSignal()));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  }

  async getEventos(): Promise<Evento[]> {
    return this.eventosSignal();
  }

  async adicionarEvento(evento: Evento): Promise<void> {
    const eventos = this.eventosSignal();
    eventos.push(evento);
    this.eventosSignal.set([...eventos]);
    this.salvarEventos();
  }

  async atualizarEvento(eventoEditado: Evento): Promise<void> {
    const eventos = this.eventosSignal();
    const index = eventos.findIndex(e => e.id === eventoEditado.id);
    if (index !== -1) {
      eventos[index] = eventoEditado;
      this.eventosSignal.set([...eventos]);
      this.salvarEventos();
    }
  }

  async excluirEvento(id: string): Promise<void> {
    const eventos = this.eventosSignal();
    const eventosFiltrados = eventos.filter(e => e.id !== id);
    this.eventosSignal.set(eventosFiltrados);
    this.salvarEventos();
  }

  async getEventosProximos(dias: number = 7): Promise<Evento[]> {
    const eventos = this.eventosSignal();
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + dias);
    
    return eventos.filter(evento => 
      evento.data >= hoje && evento.data <= limite
    ).sort((a, b) => a.data.getTime() - b.data.getTime());
  }

  async getEventosPorTipo(tipo: string): Promise<Evento[]> {
    const eventos = this.eventosSignal();
    return eventos.filter(evento => evento.tipo === tipo);
  }

  async marcarComoNotificado(id: string): Promise<void> {
    const eventos = this.eventosSignal();
    const evento = eventos.find(e => e.id === id);
    if (evento) {
      evento.notificado = true;
      this.eventosSignal.set([...eventos]);
      this.salvarEventos();
    }
  }
} 