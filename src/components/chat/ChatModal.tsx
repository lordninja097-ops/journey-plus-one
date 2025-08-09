import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName: string;
}

export const ChatModal = ({ isOpen, onClose, companionName }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "companion",
      text: `Hi! I saw you're interested in my trip. Would love to chat about traveling together!`,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate companion response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds great! When are you planning to travel?",
        "I'd love to hear more about your travel style!",
        "Perfect! Let's discuss the details.",
        "Awesome! I think we'd make great travel companions.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const companionMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "companion",
        text: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, companionMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat with {companionName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-96">
          <ScrollArea className="flex-1 p-4 border rounded-md">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" 
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
          
          <form onSubmit={sendMessage} className="flex gap-2 mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="hero">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};