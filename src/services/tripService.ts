import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trip } from '@/types/trip';

export const tripService = {
  // Create a new trip
  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'trips'), {
        ...tripData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Get all trips with optional filters
  async getTrips(filters?: {
    destination?: string;
    startDate?: string;
    interests?: string;
  }): Promise<Trip[]> {
    try {
      let q = query(
        collection(db, 'trips'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (filters?.destination) {
        q = query(q, where('destination', '>=', filters.destination));
      }

      const querySnapshot = await getDocs(q);
      const trips: Trip[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trips.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Trip);
      });

      // Apply client-side filtering for more complex searches
      let filteredTrips = trips;
      
      if (filters?.destination) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.destination.toLowerCase().includes(filters.destination!.toLowerCase())
        );
      }
      
      if (filters?.interests) {
        filteredTrips = filteredTrips.filter(trip => 
          trip.interests.toLowerCase().includes(filters.interests!.toLowerCase())
        );
      }

      return filteredTrips;
    } catch (error) {
      console.error('Error getting trips:', error);
      throw error;
    }
  },

  // Get a specific trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const docRef = doc(db, 'trips', tripId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Trip;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  },

  // Update a trip
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    try {
      const docRef = doc(db, 'trips', tripId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Delete a trip
  async deleteTrip(tripId: string): Promise<void> {
    try {
      const docRef = doc(db, 'trips', tripId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  // Get trips by user
  async getTripsByUser(userId: string): Promise<Trip[]> {
    try {
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const trips: Trip[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        trips.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as Trip);
      });
      
      return trips;
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  }
};