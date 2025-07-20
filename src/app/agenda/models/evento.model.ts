export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  tipo: 'jogo' | 'treino' | 'campeonato' | 'reuniao' | 'outro';
  lembrete: number; // minutos antes do evento
  criadoEm: Date;
  notificado?: boolean;
} 