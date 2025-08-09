const Footer = () => {
  return (
    <footer className="border-t bg-background/80">
      <div className="container mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} WanderMate — Travel Companion Finder
        </p>
        <div className="flex gap-4">
          <a href="/" className="hover:text-foreground">Home</a>
          <a href="/explore" className="hover:text-foreground">Explore</a>
          <a href="/create-trip" className="hover:text-foreground">Create Trip</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
