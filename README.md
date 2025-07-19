# eFootball Team Manager

Um aplicativo móvel completo para gerenciamento de times de eFootball, desenvolvido com Ionic, Angular e Firebase.

## 📱 Sobre o Projeto

O **eFootball Team Manager** é uma solução completa para gerenciar times de eFootball, oferecendo funcionalidades avançadas de autenticação, gerenciamento de jogadores, estatísticas detalhadas e análise de performance.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação Segura**: Login com email/senha e Google
- 👥 **Gerenciamento de Jogadores**: CRUD completo com estatísticas individuais
- 📊 **Dashboard Interativo**: Gráficos animados e estatísticas em tempo real
- 📈 **Análise de Performance**: Aproveitamento do time e ranking de jogadores
- 🔔 **Sistema de Alertas**: Notificações para W.O e quedas de performance
- 📱 **Interface Mobile**: Design iOS-style otimizado para dispositivos móveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 20** - Framework principal
- **Ionic 8** - Framework mobile
- **TypeScript 5.8** - Linguagem de programação
- **SCSS** - Pré-processador CSS

### Backend & Serviços
- **Firebase 11** - Backend-as-a-Service
  - Authentication
  - Firestore (banco de dados)
  - Real-time updates

### Mobile
- **Capacitor 7** - Bridge para funcionalidades nativas
- **Android SDK** - Build para Android

### Ferramentas de Desenvolvimento
- **Angular CLI** - CLI do Angular
- **Ionic CLI** - CLI do Ionic
- **ESLint** - Linting de código
- **Karma/Jasmine** - Testes unitários

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Android Studio** (para build Android)
- **Java JDK** (versão 21)
- **Android SDK** (API 23+)

### Contas Necessárias
- **Conta Google** (para Firebase)
- **Conta Firebase** (projeto configurado)

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/efootball-team-manager.git
cd efootball-team-manager
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication e Firestore
3. Configure o Google Sign-In
4. Copie as credenciais para `src/environments/environment.ts`

### 4. Configure o Android (Opcional)
```bash
# Instale o Capacitor
npm install @capacitor/cli

# Adicione a plataforma Android
npx cap add android

# Sincronize o projeto
npx cap sync
```

## 🏃‍♂️ Como Executar

### Desenvolvimento Local
```bash
# Inicie o servidor de desenvolvimento
ionic serve

# Ou use o comando Angular
ng serve
```

### Build para Produção
```bash
# Build para web
ionic build

# Build para Android
ionic capacitor build android
```

### Executar no Emulador/Dispositivo
```bash
# Android
ionic capacitor run android

# Com servidor externo (para desenvolvimento)
ionic capacitor run android --external
```

## 📁 Estrutura do Projeto

```
efootball-team-manager/
├── src/
│   ├── app/
│   │   ├── auth/                 # Autenticação
│   │   ├── home/                 # Dashboard principal
│   │   ├── jogadores/            # Gerenciamento de jogadores
│   │   ├── estatisticas/         # Estatísticas e gráficos
│   │   ├── services/             # Serviços (Firebase, etc.)
│   │   ├── shared/               # Componentes compartilhados
│   │   └── guards/               # Guards de rota
│   ├── assets/                   # Recursos estáticos
│   ├── environments/             # Configurações de ambiente
│   └── theme/                    # Variáveis de tema
├── android/                      # Código nativo Android
├── www/                          # Build web
└── docs/                         # Documentação
```

## 🔧 Configurações

### Firebase
O projeto está configurado para usar Firebase. Certifique-se de:

1. **Configurar Authentication**:
   - Email/Password habilitado
   - Google Sign-In habilitado

2. **Configurar Firestore**:
   - Regras de segurança configuradas
   - Estrutura de dados otimizada

3. **Configurar Android**:
   - `google-services.json` no diretório `android/app/`
   - Package name correto

### Variáveis de Ambiente
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
npm run test:coverage

# Executar linting
npm run lint
```

## 📦 Build e Deploy

### Web
```bash
# Build de produção
ionic build --prod

# Os arquivos estarão em www/
```

### Android
```bash
# Build e deploy
ionic capacitor build android
ionic capacitor run android

# Gerar APK
cd android
./gradlew assembleDebug
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: seu-email@exemplo.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/efootball-team-manager/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/efootball-team-manager/wiki)

## 🙏 Agradecimentos

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)
- [Capacitor](https://capacitorjs.com/)

---

**Desenvolvido com ❤️ para a comunidade de eFootball** 