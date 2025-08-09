import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md transition-colors ${isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="font-extrabold text-xl tracking-tight bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-glow)))] bg-clip-text text-transparent">
          WanderMate
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/create-trip" className={linkClass}>
            Create Trip
          </NavLink>
        </div>
        <div className="hidden sm:block">
          <Button variant="hero" asChild>
            <Link to="/create-trip">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
