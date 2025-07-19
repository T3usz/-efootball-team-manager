import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerStats, Position } from '../models/interfaces';
import { Player } from '../models/players.model';
import { AuthService } from './auth.service';

export interface JogadoresState {
  jogadores: Player[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class JogadoresService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Reactive state management
  private jogadoresState = signal<JogadoresState>({
    jogadores: [],
    isLoading: false,
    error: null
  });

  private jogadoresStateSubject = new BehaviorSubject<JogadoresState>(this.jogadoresState());
  public jogadoresState$ = this.jogadoresStateSubject.asObservable();

  private unsubscribe: Unsubscribe | null = null;

  constructor() {
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(authState => {
      if (authState.isAuthenticated && authState.appUser) {
        this.initializeJogadoresListener(authState.appUser.id);
      } else {
        this.clearJogadores();
      }
    });
  }

  private updateJogadoresState(newState: Partial<JogadoresState>) {
    const currentState = this.jogadoresState();
    const updatedState = { ...currentState, ...newState };
    this.jogadoresState.set(updatedState);
    this.jogadoresStateSubject.next(updatedState);
  }

  private initializeJogadoresListener(userId: string) {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.updateJogadoresState({ isLoading: true, error: null });

    const jogadoresRef = collection(this.firestore, 'users', userId, 'jogadores');
    const q = query(jogadoresRef, orderBy('name'));

    this.unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const jogadores: Player[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          jogadores.push({
            id: doc.id,
            name: data['name'],
            position: data['position'],
            number: data['number'],
            stats: data['stats'] || this.getDefaultStats(),
            isActive: data['isActive'] ?? true,
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date()
          });
        });

        this.updateJogadoresState({
          jogadores,
          isLoading: false,
          error: null
        });
      },
      (error) => {
        console.error('Error listening to jogadores:', error);
        this.updateJogadoresState({
          isLoading: false,
          error: 'Erro ao carregar jogadores'
        });
      }
    );
  }

  private clearJogadores() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.updateJogadoresState({
      jogadores: [],
      isLoading: false,
      error: null
    });
  }

  // Getters for reactive state
  get jogadores(): Player[] {
    return this.jogadoresState().jogadores;
  }

  get isLoading(): boolean {
    return this.jogadoresState().isLoading;
  }

  get error(): string | null {
    return this.jogadoresState().error;
  }

  // CRUD operations
  async adicionarJogador(jogador: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Check if number is already taken
      if (jogador.number && await this.isNumberTaken(jogador.number)) {
        throw new Error(`Número ${jogador.number} já está em uso`);
      }

      const jogadoresRef = collection(this.firestore, 'users', currentUser.id, 'jogadores');
      await addDoc(jogadoresRef, {
        name: jogador.name,
        position: jogador.position,
        number: jogador.number,
        stats: jogador.stats || this.getDefaultStats(),
        isActive: jogador.isActive ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao adicionar jogador');
    }
  }

  async atualizarJogador(jogadorId: string, updates: Partial<Player>): Promise<void> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Check if number is already taken by another player
      if (updates.number && await this.isNumberTaken(updates.number, jogadorId)) {
        throw new Error(`Número ${updates.number} já está em uso`);
      }

      const jogadorRef = doc(this.firestore, 'users', currentUser.id, 'jogadores', jogadorId);
      await updateDoc(jogadorRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar jogador');
    }
  }

  async removerJogador(jogadorId: string): Promise<void> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const jogadorRef = doc(this.firestore, 'users', currentUser.id, 'jogadores', jogadorId);
      await deleteDoc(jogadorRef);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao remover jogador');
    }
  }

  async obterJogador(jogadorId: string): Promise<Player | null> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const jogadorRef = doc(this.firestore, 'users', currentUser.id, 'jogadores', jogadorId);
      const jogadorSnap = await getDoc(jogadorRef);
      
      if (jogadorSnap.exists()) {
        const data = jogadorSnap.data();
        return {
          id: jogadorSnap.id,
          name: data['name'],
          position: data['position'],
          number: data['number'],
          stats: data['stats'] || this.getDefaultStats(),
          isActive: data['isActive'] ?? true,
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date()
        };
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao obter jogador');
    }
  }

  async atualizarEstatisticas(jogadorId: string, novasStats: Partial<PlayerStats>): Promise<void> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const jogador = await this.obterJogador(jogadorId);
      if (!jogador) {
        throw new Error('Jogador não encontrado');
      }

      const statsAtualizadas = { ...jogador.stats, ...novasStats };
      
      // Recalculate derived stats
      const totalMatches = statsAtualizadas.victories + statsAtualizadas.defeats + statsAtualizadas.draws;
      statsAtualizadas.totalMatches = totalMatches;
      statsAtualizadas.winRate = totalMatches > 0 ? Math.round((statsAtualizadas.victories / totalMatches) * 100) : 0;

      await this.atualizarJogador(jogadorId, { stats: statsAtualizadas });

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao atualizar estatísticas');
    }
  }

  // Utility methods
  private async isNumberTaken(number: number, excludeJogadorId?: string): Promise<boolean> {
    const currentUser = this.authService.currentAppUser;
    if (!currentUser) return false;

    try {
      const jogadoresRef = collection(this.firestore, 'users', currentUser.id, 'jogadores');
      const q = query(jogadoresRef, where('number', '==', number));
      const snapshot = await getDocs(q);
      
      if (excludeJogadorId) {
        return snapshot.docs.some(doc => doc.id !== excludeJogadorId);
      }
      
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking if number is taken:', error);
      return false;
    }
  }

  private getDefaultStats(): PlayerStats {
    return {
      speed: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physical: 0,
      victories: 0,
      defeats: 0,
      draws: 0,
      walkOvers: 0,
      totalMatches: 0,
      winRate: 0
    };
  }

  // Filter and search methods
  getJogadoresByPosition(position: Position): Player[] {
    return this.jogadores.filter(jogador => jogador.position === position);
  }

  getJogadoresAtivos(): Player[] {
    return this.jogadores.filter(jogador => jogador.isActive);
  }

  searchJogadores(searchTerm: string): Player[] {
    const term = searchTerm.toLowerCase();
    return this.jogadores.filter(jogador => 
      jogador.name.toLowerCase().includes(term) ||
      jogador.position.toLowerCase().includes(term) ||
      (jogador.number && jogador.number.toString().includes(term))
    );
  }

  getMelhorJogador(): Player | null {
    const jogadoresAtivos = this.getJogadoresAtivos();
    if (jogadoresAtivos.length === 0) return null;

    return jogadoresAtivos.reduce((melhor, atual) => {
      if (atual.stats.totalMatches === 0) return melhor;
      if (melhor.stats.totalMatches === 0) return atual;
      
      // Compare by win rate, then by total matches
      if (atual.stats.winRate > melhor.stats.winRate) return atual;
      if (atual.stats.winRate === melhor.stats.winRate && atual.stats.totalMatches > melhor.stats.totalMatches) return atual;
      
      return melhor;
    });
  }

  getJogadoresComAlerta(): Player[] {
    return this.jogadores.filter(jogador => jogador.stats.walkOvers >= 3);
  }

  // Statistics methods
  getTotalJogadores(): number {
    return this.jogadores.length;
  }

  getTotalJogadoresAtivos(): number {
    return this.getJogadoresAtivos().length;
  }

  getEstatisticasGerais() {
    const jogadoresAtivos = this.getJogadoresAtivos();
    const totalStats = jogadoresAtivos.reduce((acc, jogador) => ({
      victories: acc.victories + jogador.stats.victories,
      defeats: acc.defeats + jogador.stats.defeats,
      draws: acc.draws + jogador.stats.draws,
      walkOvers: acc.walkOvers + jogador.stats.walkOvers,
      totalMatches: acc.totalMatches + jogador.stats.totalMatches
    }), { victories: 0, defeats: 0, draws: 0, walkOvers: 0, totalMatches: 0 });

    return {
      ...totalStats,
      winRate: totalStats.totalMatches > 0 ? Math.round((totalStats.victories / totalStats.totalMatches) * 100) : 0,
      totalJogadores: jogadoresAtivos.length
    };
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

