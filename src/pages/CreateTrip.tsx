import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { tripService } from "@/services/tripService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please sign in to create a trip.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const tripData = {
        userId: user.uid,
        userName: formData.get("name") as string,
        userEmail: user.email || "",
        destination: formData.get("destination") as string,
        startDate: formData.get("start") as string,
        endDate: formData.get("end") as string,
        budget: formData.get("budget") as string,
        interests: formData.get("interests") as string,
        notes: formData.get("notes") as string
      };

      const tripId = await tripService.createTrip(tripData);
      
      toast({ 
        title: "Trip created successfully!", 
        description: "Your trip is now visible to potential companions." 
      });
      
      (e.currentTarget as HTMLFormElement).reset();
      navigate("/explore");
    } catch (error) {
      console.error("Error creating trip:", error);
      toast({ 
        title: "Error creating trip", 
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10">
      <Helmet>
        <title>Create a Trip | WanderMate</title>
        <meta name="description" content="Publish your travel plans with destination, dates, budget and interests to find matching companions." />
        <link rel="canonical" href="/create-trip" />
      </Helmet>

      <h1 className="text-3xl font-bold">Create your trip</h1>
      <p className="text-muted-foreground mt-1">Share your plans to get matched with companions</p>

      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 grid gap-2">
              <label className="text-sm">Your name</label>
              <Input name="name" placeholder="e.g., Alex Smith" required aria-label="Your name" />
            </div>
            <div className="sm:col-span-2 grid gap-2">
              <label className="text-sm">Destination</label>
              <Input name="destination" placeholder="e.g., Japan" required aria-label="Destination" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Start date</label>
              <Input type="date" name="start" required aria-label="Start date" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">End date</label>
              <Input type="date" name="end" required aria-label="End date" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Budget</label>
              <Input name="budget" placeholder="$1000" aria-label="Budget" />
            </div>
            <div className="sm:col-span-2 grid gap-2">
              <label className="text-sm">Interests</label>
              <Input name="interests" placeholder="Hiking, food, photography" aria-label="Interests" />
            </div>
            <div className="sm:col-span-2 grid gap-2">
              <label className="text-sm">Notes</label>
              <Textarea name="notes" placeholder="Tell companions about your plan" aria-label="Notes" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="hero" disabled={loading}>
                {loading ? "Publishing..." : "Publish trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateTrip;
