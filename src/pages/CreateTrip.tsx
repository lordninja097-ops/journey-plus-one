import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CreateTrip = () => {
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Trip published (mock)", description: "Your trip is visible to potential companions." });
    (e.currentTarget as HTMLFormElement).reset();
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
              <Button type="submit" variant="hero">Publish trip</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateTrip;
