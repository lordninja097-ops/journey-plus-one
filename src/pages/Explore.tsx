import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatModal } from "@/components/chat/ChatModal";
import { MessageCircle } from "lucide-react";

interface Companion {
  name: string;
  destination: string;
  style: string;
  dates: string;
  budget: string;
}

const MOCK: Companion[] = [
  { name: "Ava", destination: "Japan", style: "Food & Culture", dates: "Apr 10–20", budget: "$1500" },
  { name: "Leo", destination: "Peru", style: "Hiking", dates: "May 3–12", budget: "$1200" },
  { name: "Maya", destination: "Portugal", style: "Surf & Cities", dates: "Jun 1–10", budget: "$900" },
  { name: "Noah", destination: "Italy", style: "Museums & Wine", dates: "Jul 8–18", budget: "$1800" },
];

const useQuery = () => new URLSearchParams(useLocation().search);

const Explore = () => {
  const q = useQuery();
  const [destination, setDestination] = useState(q.get("q") || "");
  const [style, setStyle] = useState(q.get("style") || "");
  const [month, setMonth] = useState(q.get("month") || "");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string>("");

  const results = useMemo(() => {
    return MOCK.filter((c) =>
      (destination ? c.destination.toLowerCase().includes(destination.toLowerCase()) : true) &&
      (style ? c.style.toLowerCase().includes(style.toLowerCase()) : true) &&
      (month ? c.dates.toLowerCase().includes(month.toLowerCase()) : true)
    );
  }, [destination, style, month]);

  const openChat = (companionName: string) => {
    setSelectedCompanion(companionName);
    setChatOpen(true);
  };
  return (
    <main className="container mx-auto py-10">
      <Helmet>
        <title>Explore Travel Companions | WanderMate</title>
        <meta name="description" content="Browse and filter travelers by destination, dates, and interests to find your ideal travel companion." />
        <link rel="canonical" href="/explore" />
      </Helmet>

      <h1 className="text-3xl font-bold">Explore companions</h1>
      <p className="text-muted-foreground mt-1">Refine your search and start a conversation</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" aria-label="Destination" />
        <Input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" aria-label="Month" />
        <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Travel style" aria-label="Travel style" />
        <Button variant="hero">Apply filters</Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <Card key={c.name} className="hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)_/_0.25)] transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">{c.style}</p>
                </div>
                <span className="text-sm px-2 py-1 rounded bg-secondary">{c.destination}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 text-sm gap-2">
                <span className="text-muted-foreground">Dates</span>
                <span>{c.dates}</span>
                <span className="text-muted-foreground">Budget</span>
                <span>{c.budget}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">View profile</Button>
                <Button 
                  variant="hero" 
                  size="icon"
                  onClick={() => openChat(c.name)}
                  className="shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-muted-foreground">No matches yet. Try broadening your filters.</p>
        )}
      </div>
      
      <ChatModal 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        companionName={selectedCompanion}
      />
    </main>
  );
};

export default Explore;
