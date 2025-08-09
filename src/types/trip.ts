export interface Trip {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  tripId: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
}