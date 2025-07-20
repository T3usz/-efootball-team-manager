// App User Interface
export interface AppUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Team Interface
export interface Team {
  id: string;
  name: string;
  adminId: string;
  adminName: string;
  modality: 'Futebol';
  createdAt: Date;
  updatedAt: Date;
  stats: TeamStats;
}

// Team Statistics
export interface TeamStats {
  totalMatches: number;
  victories: number;
  draws: number;
  defeats: number;
  walkOvers: number;
  winRate: number;
}

// Player Interface
export interface Player {
  id: string;
  name: string;
  nickname: string;
  age: number;
  position: string;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
  stats: PlayerStats;
}

// Player Statistics
export interface PlayerStats {
  totalMatches: number;
  victories: number;
  draws: number;
  defeats: number;
  walkOvers: number;
  winRate: number;
}

// Match Result
export interface Match {
  id: string;
  playerId: string;
  playerName: string;
  playerNickname: string;
  result: MatchResult;
  date: Date;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
}

// Match Result Types
export type MatchResult = 'victory' | 'draw' | 'defeat' | 'walkover';

// Log Entry
export interface LogEntry {
  id: string;
  action: LogAction;
  description: string;
  adminId: string;
  adminName: string;
  timestamp: Date;
  metadata?: any;
}

// Log Action Types
export type LogAction = 
  | 'player_added'
  | 'player_updated'
  | 'player_removed'
  | 'match_registered'
  | 'match_updated'
  | 'match_removed'
  | 'team_updated'
  | 'schedule_added'
  | 'schedule_updated'
  | 'schedule_removed'
  | 'backup_created'
  | 'data_imported';

// Schedule Entry
export interface ScheduleEntry {
  id: string;
  title: string;
  description: string;
  date: Date;
  players: string[];
  status: ScheduleStatus;
  result?: ScheduleResult;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule Status
export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled';

// Schedule Result
export interface ScheduleResult {
  playerId: string;
  result: MatchResult;
  observations: string;
}

// Ranking Entry
export interface RankingEntry {
  player: Player;
  position: number;
  stats: PlayerStats;
}

// Form Interfaces
export interface PlayerForm {
  name: string;
  nickname: string;
  age: number;
  position: string;
  observations: string;
}

export interface TeamForm {
  name: string;
  adminName: string;
}

export interface MatchForm {
  playerId: string;
  result: MatchResult;
  date: Date;
  observations: string;
}

export interface ScheduleForm {
  title: string;
  description: string;
  date: Date;
  players: string[];
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Statistics Summary
export interface StatsSummary {
  team: TeamStats;
  topPlayer: Player | null;
  recentMatches: Match[];
  upcomingSchedule: ScheduleEntry[];
  alerts: Alert[];
}

// Alert Interface
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  playerId?: string;
  playerName?: string;
  severity: AlertSeverity;
  createdAt: Date;
  dismissed: boolean;
}

// Alert Types
export type AlertType = 'walkover_warning' | 'performance_alert' | 'schedule_reminder';
export type AlertSeverity = 'low' | 'medium' | 'high';

// Backup Interface
export interface BackupData {
  team: Team;
  players: any[]; // Using any to avoid circular dependency
  matches: Match[];
  schedule: ScheduleEntry[];
  logs: LogEntry[];
  exportedAt: Date;
  version: string;
}

// Configuration Interface
export interface AppConfig {
  notifications: {
    walkoverAlerts: boolean;
    scheduleReminders: boolean;
    performanceAlerts: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US';
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

// Firebase Document Interfaces (for Firestore)
export interface FirebaseUser {
  email: string;
  displayName: string;
  createdAt: any; // Firestore Timestamp
  lastLogin: any; // Firestore Timestamp
}

export interface FirebaseTeam {
  name: string;
  adminId: string;
  adminName: string;
  modality: 'eFootball';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  stats: TeamStats;
}

export interface FirebasePlayer {
  name: string;
  nickname: string;
  age: number;
  position: string;
  observations: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  stats: PlayerStats;
}

export interface FirebaseMatch {
  playerId: string;
  playerName: string;
  playerNickname: string;
  result: MatchResult;
  date: any; // Firestore Timestamp
  observations: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface FirebaseLogEntry {
  action: LogAction;
  description: string;
  adminId: string;
  adminName: string;
  timestamp: any; // Firestore Timestamp
  metadata?: any;
}

export interface FirebaseScheduleEntry {
  title: string;
  description: string;
  date: any; // Firestore Timestamp
  players: string[];
  status: ScheduleStatus;
  result?: ScheduleResult;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

