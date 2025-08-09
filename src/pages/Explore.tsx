import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { tripService } from "@/services/tripService";
import { Trip } from "@/types/trip";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatModal } from "@/components/chat/ChatModal";
import { MessageCircle } from "lucide-react";

const useQuery = () => new URLSearchParams(useLocation().search);

const Explore = () => {
  const q = useQuery();
  const { user } = useAuth();
  const [destination, setDestination] = useState(q.get("q") || "");
  const [style, setStyle] = useState(q.get("style") || "");
  const [month, setMonth] = useState(q.get("month") || "");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const allTrips = await tripService.getTrips();
      // Filter out current user's trips
      const otherTrips = allTrips.filter(trip => trip.userId !== user?.uid);
      setTrips(otherTrips);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    return trips.filter((trip) =>
      (destination ? trip.destination.toLowerCase().includes(destination.toLowerCase()) : true) &&
      (style ? trip.interests.toLowerCase().includes(style.toLowerCase()) : true) &&
      (month ? 
        new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short' }).toLowerCase().includes(month.toLowerCase()) ||
        new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short' }).toLowerCase().includes(month.toLowerCase())
        : true)
    );
  }, [trips, destination, style, month]);

  const openChat = (trip: Trip) => {
    setSelectedTrip(trip);
    setChatOpen(true);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
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

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((trip) => (
          <Card key={trip.id} className="hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)_/_0.25)] transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{trip.userName}</h2>
                  <p className="text-sm text-muted-foreground">{trip.interests}</p>
                </div>
                <span className="text-sm px-2 py-1 rounded bg-secondary">{trip.destination}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 text-sm gap-2">
                <span className="text-muted-foreground">Dates</span>
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className="text-muted-foreground">Budget</span>
                <span>{trip.budget}</span>
              </div>
              {trip.notes && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{trip.notes}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">View profile</Button>
                <Button 
                  variant="hero" 
                  size="icon"
                  onClick={() => openChat(trip)}
                  className="shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-muted-foreground sm:col-span-2 lg:col-span-3 text-center py-8">
            {loading ? "Loading trips..." : "No matches yet. Try broadening your filters."}
          </p>
        )}
      </div>
      )}
      
      <ChatModal 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        trip={selectedTrip}
      />
    </main>
  );
};

export default Explore;
