import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonAvatar,
  IonAlert,
  AlertController,
  ToastController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  settings, 
  person, 
  notifications, 
  moon, 
  language, 
  cloudDownload, 
  cloudUpload,
  trash,
  information,
  shield,
  help,
  logOut,
  chevronForward,
  checkmark,
  close
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from '../shared/models/interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonAvatar,
  ]
})
export class ConfiguracoesPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private actionSheetController = inject(ActionSheetController);

  config: AppConfig = {
    notifications: {
      walkoverAlerts: true,
      scheduleReminders: true,
      performanceAlerts: true
    },
    display: {
      theme: 'auto',
      language: 'pt-BR'
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'weekly'
    }
  };

  user: any = null;
  isLoading = false;

  private subscription = new Subscription();

  constructor() {
    addIcons({ 
      settings, 
      person, 
      notifications, 
      moon, 
      language, 
      cloudDownload, 
      cloudUpload,
      trash,
      information,
      shield,
      help,
      logOut,
      chevronForward,
      checkmark,
      close
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadConfig();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadUserData() {
    this.subscription.add(
      this.authService.authState$.subscribe(authState => {
        this.user = authState.appUser;
      })
    );
  }

  private loadConfig() {
    // TODO: Load config from Firebase
    // For now, using default config
  }

  async onNotificationToggle(type: keyof AppConfig['notifications']) {
    this.config.notifications[type] = !this.config.notifications[type];
    await this.saveConfig();
    await this.showToast(`${type === 'walkoverAlerts' ? 'Alertas de W.O' : type === 'scheduleReminders' ? 'Lembretes de Agenda' : 'Alertas de Performance'} ${this.config.notifications[type] ? 'ativados' : 'desativados'}`);
  }

  async onThemeChange(event: any) {
    this.config.display.theme = event.detail.value;
    await this.saveConfig();
    await this.showToast(`Tema alterado para ${this.config.display.theme}`);
  }

  async onLanguageChange(event: any) {
    this.config.display.language = event.detail.value;
    await this.saveConfig();
    await this.showToast(`Idioma alterado para ${this.config.display.language === 'pt-BR' ? 'Português' : 'English'}`);
  }

  async onBackupToggle() {
    this.config.backup.autoBackup = !this.config.backup.autoBackup;
    await this.saveConfig();
    await this.showToast(`Backup automático ${this.config.backup.autoBackup ? 'ativado' : 'desativado'}`);
  }

  async onBackupFrequencyChange(event: any) {
    this.config.backup.backupFrequency = event.detail.value;
    await this.saveConfig();
    await this.showToast(`Frequência de backup alterada para ${this.config.backup.backupFrequency}`);
  }

  private async saveConfig() {
    // TODO: Save config to Firebase
    console.log('Saving config:', this.config);
  }

  async openProfile() {
    this.router.navigate(['/configuracoes/perfil']);
  }

  async openBackup() {
    this.router.navigate(['/configuracoes/backup']);
  }

  async openPrivacy() {
    this.router.navigate(['/configuracoes/privacidade']);
  }

  async openHelp() {
    this.router.navigate(['/configuracoes/ajuda']);
  }

  async openAbout() {
    this.router.navigate(['/configuracoes/sobre']);
  }

  async showDataManagement() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Gerenciamento de Dados',
      buttons: [
        {
          text: 'Exportar Dados',
          icon: 'cloud-download',
          handler: () => this.exportData()
        },
        {
          text: 'Importar Dados',
          icon: 'cloud-upload',
          handler: () => this.importData()
        },
        {
          text: 'Limpar Cache',
          icon: 'trash',
          handler: () => this.clearCache()
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async exportData() {
    // TODO: Implement data export
    await this.showToast('Exportação de dados em desenvolvimento');
  }

  async importData() {
    // TODO: Implement data import
    await this.showToast('Importação de dados em desenvolvimento');
  }

  async clearCache() {
    const alert = await this.alertController.create({
      header: 'Limpar Cache',
      message: 'Tem certeza que deseja limpar o cache? Isso pode melhorar a performance do app.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpar',
          handler: () => {
            // TODO: Implement cache clearing
            this.showToast('Cache limpo com sucesso');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Logout',
      message: 'Tem certeza que deseja sair da sua conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          role: 'destructive',
          handler: async () => {
            try {
              await this.authService.signOut();
              this.router.navigate(['/auth/login']);
            } catch (error) {
              await this.showToast('Erro ao fazer logout', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  getThemeLabel(theme: string): string {
    const labels: Record<string, string> = {
      'light': 'Claro',
      'dark': 'Escuro',
      'auto': 'Automático'
    };
    return labels[theme] || theme;
  }

  getLanguageLabel(language: string): string {
    const labels: Record<string, string> = {
      'pt-BR': 'Português',
      'en-US': 'English'
    };
    return labels[language] || language;
  }

  getBackupFrequencyLabel(frequency: string): string {
    const labels: Record<string, string> = {
      'daily': 'Diário',
      'weekly': 'Semanal',
      'monthly': 'Mensal'
    };
    return labels[frequency] || frequency;
  }
} 