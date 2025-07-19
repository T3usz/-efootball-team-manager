import { PlayerStats, Position } from "./interfaces";


export interface Player {
  id: string;
  name: string;
  number: number;
  isActive: boolean;
  position: Position;
  stats: PlayerStats;
  createdAt: Date;
  updatedAt: Date;
}

export { Position } from "./interfaces";
