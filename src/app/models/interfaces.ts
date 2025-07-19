
export interface PlayerStats {
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  
  victories: number;
  defeats: number;
  draws: number;
  totalMatches: number;
  winRate: number;
  walkOvers: number; // ⬅️ Adicione essa linha
}
export type Position =  // <-- CORRETO
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CM'
  | 'LM'
  | 'RM'
  | 'CAM'
  | 'ST'
  | 'LW'
  | 'RW';
// src/shared/models/interfaces.ts
export interface FullPlayerStats extends PlayerStats {
  victories: number;
  defeats: number;
  draws: number;
  walkOvers: number;
  totalMatches: number;
  winRate: number;
}
