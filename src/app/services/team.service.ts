import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../shared/models/interfaces';

export interface TeamState {
  team: Team | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  // Reactive state management
  private teamState = signal<TeamState>({
    team: null,
    isLoading: false,
    error: null
  });

  private teamStateSubject = new BehaviorSubject<TeamState>(this.teamState());
  public teamState$ = this.teamStateSubject.asObservable();

  constructor() {
    this.loadTeamData();
  }

  private updateTeamState(newState: Partial<TeamState>) {
    const currentState = this.teamState();
    const updatedState = { ...currentState, ...newState };
    this.teamState.set(updatedState);
    this.teamStateSubject.next(updatedState);
  }

  private loadTeamData() {
    // Carregar dados do localStorage ou usar padrão
    const savedTeam = localStorage.getItem('teamData');
    
    if (savedTeam) {
      try {
        const teamData = JSON.parse(savedTeam);
        this.updateTeamState({ team: teamData });
      } catch (error) {
        console.error('Erro ao carregar dados do time:', error);
        this.createDefaultTeam();
      }
    } else {
      this.createDefaultTeam();
    }
  }

  private createDefaultTeam() {
    const defaultTeam: Team = {
      id: '1',
      name: 'Time Principal',
      adminId: 'admin-1',
      adminName: 'Administrador',
      logo: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        victories: 0,
        draws: 0,
        defeats: 0,
        walkOvers: 0,
        totalMatches: 0,
        winRate: 0
      }
    };

    this.updateTeamState({ team: defaultTeam });
    this.saveTeamData(defaultTeam);
  }

  private saveTeamData(team: Team) {
    try {
      localStorage.setItem('teamData', JSON.stringify(team));
    } catch (error) {
      console.error('Erro ao salvar dados do time:', error);
    }
  }

  // Getters for reactive state
  get currentTeam(): Team | null {
    return this.teamState().team;
  }

  get isLoading(): boolean {
    return this.teamState().isLoading;
  }

  get error(): string | null {
    return this.teamState().error;
  }

  // Public methods
  updateTeam(updates: Partial<Team>): void {
    const currentTeam = this.currentTeam;
    
    if (currentTeam) {
      const updatedTeam: Team = {
        ...currentTeam,
        ...updates,
        updatedAt: new Date()
      };

      this.updateTeamState({ team: updatedTeam });
      this.saveTeamData(updatedTeam);
    }
  }

  resetTeam(): void {
    localStorage.removeItem('teamData');
    this.createDefaultTeam();
  }
} 