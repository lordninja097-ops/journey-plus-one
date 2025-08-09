import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, ChatRoom } from '@/types/trip';

export const chatService = {
  // Create or get existing chat room
  async createOrGetChatRoom(tripId: string, userId: string, userName: string, tripOwnerId: string, tripOwnerName: string): Promise<string> {
    try {
      // Check if chat room already exists
      const q = query(
        collection(db, 'chatRooms'),
        where('tripId', '==', tripId),
        where('participants', 'array-contains', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      
      // Create new chat room
      const docRef = await addDoc(collection(db, 'chatRooms'), {
        tripId,
        participants: [userId, tripOwnerId],
        participantNames: {
          [userId]: userName,
          [tripOwnerId]: tripOwnerName
        },
        createdAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating/getting chat room:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(chatRoomId: string, senderId: string, senderName: string, receiverId: string, text: string): Promise<void> {
    try {
      // Add message to messages collection
      await addDoc(collection(db, 'messages'), {
        chatRoomId,
        senderId,
        senderName,
        receiverId,
        text,
        timestamp: Timestamp.now(),
        read: false
      });

      // Update chat room with last message info
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      await updateDoc(chatRoomRef, {
        lastMessage: text,
        lastMessageTime: Timestamp.now()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get messages for a chat room
  async getMessages(chatRoomId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('chatRoomId', '==', chatRoomId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Subscribe to messages in real-time
  subscribeToMessages(chatRoomId: string, callback: (messages: Message[]) => void): () => void {
    const q = query(
      collection(db, 'messages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        } as Message);
      });
      callback(messages);
    });
  },

  // Get chat rooms for a user
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const q = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const chatRooms: ChatRoom[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chatRooms.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          lastMessageTime: data.lastMessageTime?.toDate()
        } as ChatRoom);
      });
      
      return chatRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  }
};