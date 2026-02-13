export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/bg-grain-fog.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative container mx-auto px-4 py-24 text-center">
        <img
          src="/assets/generated/app-logo.dim_512x512.png"
          alt="Phantom Edit Logo"
          className="w-32 h-32 mx-auto mb-8 opacity-90"
        />
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Phantom Edit
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Transform your photos with realistic paranormal effects. Add shadow figures, ghosts, 
          glowing eyes, and more to create spine-chilling images.
        </p>
        
        <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
          For entertainment purposes only. Always ensure you have permission to edit and share photos.
        </p>
      </div>
    </section>
  );
}
