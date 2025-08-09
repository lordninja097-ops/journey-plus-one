import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { chatService } from "@/services/chatService";
import { tripService } from "@/services/tripService";
import { useToast } from "@/hooks/use-toast";
import { Trip, Message } from "@/types/trip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const ChatModal = ({ isOpen, onClose, trip }: ChatModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && trip && user) {
      initializeChat();
    }
  }, [isOpen, trip, user]);

  useEffect(() => {
    if (chatRoomId) {
      const unsubscribe = chatService.subscribeToMessages(chatRoomId, (newMessages) => {
        setMessages(newMessages);
      });
      
      return () => unsubscribe();
    }
  }, [chatRoomId]);

  const initializeChat = async () => {
    if (!trip || !user) return;
    
    try {
      setLoading(true);
      const roomId = await chatService.createOrGetChatRoom(
        trip.id,
        user.uid,
        user.displayName || "Anonymous User",
        trip.userId,
        trip.userName
      );
      setChatRoomId(roomId);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoomId || !user || !trip) return;

    try {
      await chatService.sendMessage(
        chatRoomId,
        user.uid,
        user.displayName || "Anonymous User",
        trip.userId,
        newMessage
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setMessages([]);
    setChatRoomId(null);
    setNewMessage("");
    onClose();
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === user?.uid;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Chat with {trip?.userName} - {trip?.destination}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-96">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
          <ScrollArea className="flex-1 p-4 border rounded-md">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      isOwnMessage(message)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage(message)
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          )}
          
          <form onSubmit={sendMessage} className="flex gap-2 mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={loading || !chatRoomId}
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="hero"
              disabled={loading || !chatRoomId || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};