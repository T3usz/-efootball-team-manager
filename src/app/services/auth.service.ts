import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../shared/models/interfaces';

export interface AuthState {
  user: User | null;
  appUser: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Reactive state management
  private authState = signal<AuthState>({
    user: null,
    appUser: null,
    isAuthenticated: false,
    isLoading: true
  });

  private authStateSubject = new BehaviorSubject<AuthState>(this.authState());
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const appUser = await this.loadUserProfile(user.uid);
        this.updateAuthState({
          user,
          appUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        this.updateAuthState({
          user: null,
          appUser: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });
  }

  private updateAuthState(newState: AuthState) {
    this.authState.set(newState);
    this.authStateSubject.next(newState);
  }

  // Getters for reactive state
  get currentUser(): User | null {
    return this.authState().user;
  }

  get currentAppUser(): AppUser | null {
    return this.authState().appUser;
  }

  get isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  get isLoading(): boolean {
    return this.authState().isLoading;
  }

  // Authentication methods
  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      this.updateAuthState({ ...this.authState(), isLoading: true });
      
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      const appUser: AppUser = {
        id: user.uid,
        email: user.email!,
        name: displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.createUserProfile(user.uid, appUser);

      this.updateAuthState({
        user,
        appUser,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      this.updateAuthState({ ...this.authState(), isLoading: false });
      throw this.handleAuthError(error);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.updateAuthState({ ...this.authState(), isLoading: true });
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Update last login
      await this.updateLastLogin(user.uid);
      
      const appUser = await this.loadUserProfile(user.uid);

      this.updateAuthState({
        user,
        appUser,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      this.updateAuthState({ ...this.authState(), isLoading: false });
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      this.updateAuthState({ ...this.authState(), isLoading: true });
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;

      // Check if user profile exists, create if not
      let appUser = await this.loadUserProfile(user.uid);
      
      if (!appUser) {
        appUser = {
          id: user.uid,
          email: user.email!,
          name: user.displayName || 'Usuário',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.createUserProfile(user.uid, appUser);
      } else {
        await this.updateLastLogin(user.uid);
      }

      this.updateAuthState({
        user,
        appUser,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {
      this.updateAuthState({ ...this.authState(), isLoading: false });
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.updateAuthState({
        user: null,
        appUser: null,
        isAuthenticated: false,
        isLoading: false
      });
      this.router.navigate(['/auth/login']);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async updateUserProfile(updates: Partial<AppUser>): Promise<void> {
    const currentUser = this.currentUser;
    const currentAppUser = this.currentAppUser;
    
    if (!currentUser || !currentAppUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Update Firestore document
      const userRef = doc(this.firestore, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update local state
      const updatedAppUser = { ...currentAppUser, ...updates, updatedAt: new Date() };
      this.updateAuthState({
        ...this.authState(),
        appUser: updatedAppUser
      });

      // Update Firebase Auth profile if name changed
      if (updates.name && updates.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: updates.name });
      }

    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Private helper methods
  private async createUserProfile(uid: string, appUser: AppUser): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await setDoc(userRef, {
      email: appUser.email,
      name: appUser.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  private async loadUserProfile(uid: string): Promise<AppUser | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: uid,
          email: data['email'],
          name: data['name'],
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private handleAuthError(error: any): Error {
    let message = 'Erro de autenticação';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta';
        break;
      case 'auth/email-already-in-use':
        message = 'Este email já está em uso';
        break;
      case 'auth/weak-password':
        message = 'A senha deve ter pelo menos 6 caracteres';
        break;
      case 'auth/invalid-email':
        message = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Login cancelado pelo usuário';
        break;
      default:
        message = error.message || 'Erro desconhecido';
    }
    
    return new Error(message);
  }

  // Utility methods
  async checkEmailExists(email: string): Promise<boolean> {
    // This would require additional Firebase setup or backend endpoint
    // For now, we'll handle this in the sign-up flow
    return false;
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isPasswordValid(password: string): boolean {
    return password.length >= 6;
  }
}

