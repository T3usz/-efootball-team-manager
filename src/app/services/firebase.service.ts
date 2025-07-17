import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  Query
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Collections
  getUsersCollection() {
    return collection(this.firestore, 'users');
  }

  getTeamsCollection() {
    return collection(this.firestore, 'teams');
  }

  getTeamPlayersCollection(teamId: string) {
    return collection(this.firestore, `teams/${teamId}/players`);
  }

  getTeamMatchesCollection(teamId: string) {
    return collection(this.firestore, `teams/${teamId}/matches`);
  }

  getTeamScheduleCollection(teamId: string) {
    return collection(this.firestore, `teams/${teamId}/schedule`);
  }

  getTeamLogsCollection(teamId: string) {
    return collection(this.firestore, `teams/${teamId}/logs`);
  }

  // Document references
  getUserDoc(userId: string) {
    return doc(this.firestore, `users/${userId}`);
  }

  getTeamDoc(teamId: string) {
    return doc(this.firestore, `teams/${teamId}`);
  }

  getPlayerDoc(teamId: string, playerId: string) {
    return doc(this.firestore, `teams/${teamId}/players/${playerId}`);
  }

  getMatchDoc(teamId: string, matchId: string) {
    return doc(this.firestore, `teams/${teamId}/matches/${matchId}`);
  }

  // CRUD Operations
  async createDocument<T>(collectionRef: CollectionReference, data: T): Promise<string> {
    try {
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async updateDocument<T>(docRef: DocumentReference, data: Partial<T>): Promise<void> {
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteDocument(docRef: DocumentReference): Promise<void> {
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async getDocument<T>(docRef: DocumentReference): Promise<T | null> {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  async getDocuments<T>(queryRef: Query | CollectionReference): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToDocument<T>(docRef: DocumentReference): Observable<T | null> {
    return new Observable(observer => {
      const unsubscribe = onSnapshot(docRef, 
        (doc) => {
          if (doc.exists()) {
            observer.next({ id: doc.id, ...doc.data() } as T);
          } else {
            observer.next(null);
          }
        },
        (error) => {
          console.error('Error in document subscription:', error);
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  subscribeToCollection<T>(queryRef: Query | CollectionReference): Observable<T[]> {
    return new Observable(observer => {
      const unsubscribe = onSnapshot(queryRef,
        (querySnapshot) => {
          const documents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          observer.next(documents);
        },
        (error) => {
          console.error('Error in collection subscription:', error);
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }

  // Query builders
  createQuery(collectionRef: CollectionReference, ...constraints: any[]) {
    return query(collectionRef, ...constraints);
  }

  // Common query constraints
  whereEqual(field: string, value: any) {
    return where(field, '==', value);
  }

  orderByField(field: string, direction: 'asc' | 'desc' = 'asc') {
    return orderBy(field, direction);
  }

  limitResults(count: number) {
    return limit(count);
  }

  // Current user helper
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Timestamp helpers
  getServerTimestamp() {
    // This will be replaced with actual Firestore server timestamp
    return new Date();
  }

  convertTimestamp(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  }
}

