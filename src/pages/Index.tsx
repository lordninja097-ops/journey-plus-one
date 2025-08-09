import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChatModal } from "@/components/chat/ChatModal";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<string>("");

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      q: String(form.get("destination") || ""),
      style: String(form.get("style") || ""),
      month: String(form.get("month") || ""),
    }).toString();
    navigate(`/explore?${params}`);
  };

  const openChat = (companionName: string) => {
    setSelectedCompanion(companionName);
    setChatOpen(true);
  };
  return (
    <main>
      <Helmet>
        <title>Travel Companion Finder | WanderMate</title>
        <meta name="description" content="Find your perfect travel companion by destination, dates, and interests. Plan trips and explore together." />
        <link rel="canonical" href="/" />
      </Helmet>

      <section className="hero-glow">
        <div
          className="container mx-auto grid gap-10 py-20 md:grid-cols-2 items-center"
          onMouseMove={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            const rect = el.getBoundingClientRect();
            el.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
            el.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
          }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Find your perfect travel companion
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Match with like‑minded travelers by destination, dates, and travel style. Safer journeys, richer memories.
            </p>
            <form onSubmit={onSearch} className="mt-8 grid gap-3 sm:grid-cols-4 bg-card p-3 rounded-lg border shadow-sm">
              <Input name="destination" placeholder="Where to? (e.g., Lisbon)" className="sm:col-span-2" aria-label="Destination" />
              <Input name="month" placeholder="Month" aria-label="Month" />
              <Input name="style" placeholder="Style (e.g., Backpacking)" aria-label="Travel style" />
              <Button type="submit" variant="hero" className="sm:col-span-4 md:col-span-1">Search companions</Button>
            </form>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Panoramic coastal city at golden hour, inspiring travel"
              className="w-full rounded-lg border shadow-[0_10px_30px_-10px_hsl(var(--primary)_/_0.25)]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <h2 className="text-2xl font-bold">Nearest companions</h2>
        <p className="text-muted-foreground mt-1">Travelers close to your location looking for buddies</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Ava", destination: "Japan", style: "Food & Culture", dates: "Apr 10–20" },
            { name: "Leo", destination: "Peru", style: "Hiking", dates: "May 3–12" },
            { name: "Maya", destination: "Portugal", style: "Surf & Cities", dates: "Jun 1–10" },
          ].map((c) => (
            <Card key={c.name} className="hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)_/_0.25)] transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.style}</p>
                  </div>
                  <span className="text-sm px-2 py-1 rounded bg-secondary">{c.destination}</span>
                </div>
                <p className="mt-4 text-sm">Dates: {c.dates}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/explore")}>View matches</Button>
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
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold">Smart matching</h3>
            <p className="text-muted-foreground mt-1">Filter by destination, time window, budget and interests.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold">Safety first</h3>
            <p className="text-muted-foreground mt-1">Profiles with verifications and in‑app messaging (coming soon).</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold">Plan together</h3>
            <p className="text-muted-foreground mt-1">Share itineraries, split costs and collaborate easily.</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button variant="hero" onClick={() => navigate("/create-trip")}>Create your trip</Button>
        </div>
      </section>
      
      <ChatModal 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        companionName={selectedCompanion}
      />
    </main>
  );
};

export default Index;
