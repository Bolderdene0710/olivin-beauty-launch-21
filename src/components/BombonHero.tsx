const candies = [
  { emoji: "🍬", className: "top-[15%] left-[8%] text-5xl md:text-7xl animate-float-1 drop-shadow-lg" },
  { emoji: "🐻", className: "top-[10%] right-[12%] text-4xl md:text-6xl animate-float-2 drop-shadow-lg" },
  { emoji: "🍫", className: "top-[35%] left-[3%] text-4xl md:text-5xl animate-float-3 drop-shadow-lg" },
  { emoji: "🍭", className: "bottom-[35%] right-[5%] text-5xl md:text-7xl animate-float-4 drop-shadow-lg" },
  { emoji: "🍩", className: "top-[20%] left-[45%] text-3xl md:text-5xl animate-float-5 drop-shadow-lg" },
  { emoji: "🧁", className: "bottom-[25%] left-[15%] text-4xl md:text-6xl animate-float-2 drop-shadow-lg" },
  { emoji: "🍪", className: "top-[60%] right-[15%] text-3xl md:text-5xl animate-float-1 drop-shadow-lg" },
  { emoji: "🍡", className: "top-[8%] left-[30%] text-3xl md:text-4xl animate-float-4 drop-shadow-lg" },
  { emoji: "🧃", className: "bottom-[40%] left-[40%] text-3xl md:text-4xl animate-float-3 drop-shadow-lg" },
  { emoji: "🍬", className: "top-[50%] right-[30%] text-4xl md:text-5xl animate-float-5 drop-shadow-lg rotate-45" },
  { emoji: "🍇", className: "bottom-[20%] right-[40%] text-3xl md:text-4xl animate-float-1 drop-shadow-lg" },
  { emoji: "🫐", className: "top-[70%] left-[60%] text-2xl md:text-3xl animate-float-2 drop-shadow-lg" },
];

const BombonHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Floating Candy Elements */}
      {candies.map((candy, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none select-none z-10 ${candy.className}`}
          style={{ opacity: 0 }}
        >
          {candy.emoji}
        </div>
      ))}

      {/* Main Headline */}
      <div className="relative z-20 text-center max-w-6xl mx-auto pt-20">
        <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] uppercase text-foreground tracking-tight">
          OLIVIN
        </h1>
        <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] uppercase text-foreground tracking-tight">
          BEAUTY
        </h1>

        <p className="mt-8 md:mt-12 text-base md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          In the land of Olivin, beauty holds the crown. Experience the elegance
          of Korean skincare in its purest form.
        </p>
      </div>

      {/* Bottom Product Mockup Area */}
      <div className="relative z-20 mt-12 md:mt-20 flex flex-col items-center">
        {/* Candy bag mockup placeholder */}
        <div className="relative w-48 h-64 md:w-64 md:h-80 rounded-3xl bg-gradient-to-b from-primary to-primary-dark shadow-2xl flex items-center justify-center transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
          <div className="text-center px-4">
            <span className="font-display text-2xl md:text-3xl text-primary-foreground uppercase tracking-wider">
              OLIVIN
            </span>
            <div className="mt-2 text-xs md:text-sm text-primary-foreground/80 font-medium">
              Royal Mix
            </div>
            <div className="mt-4 text-4xl md:text-5xl">🍬</div>
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Play the game badge */}
        <div className="absolute -bottom-4 -right-8 md:right-[-60px] w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center transform rotate-12 shadow-lg hover:rotate-0 transition-transform duration-300 cursor-pointer">
          <span className="font-display text-xs md:text-sm text-accent-foreground uppercase text-center leading-tight">
            play<br />THE<br />game
          </span>
        </div>
      </div>

      {/* Fog / Cloud Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-60 z-30 pointer-events-none">
        <div className="absolute bottom-0 left-[-10%] w-[120%] h-full bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-4 left-[10%] w-64 h-20 bg-primary-light/30 rounded-full blur-3xl animate-fog" />
        <div className="absolute bottom-8 right-[15%] w-48 h-16 bg-primary/20 rounded-full blur-3xl animate-fog" style={{ animationDelay: '3s' }} />
      </div>

      {/* Music Note Badge - bottom left */}
      <div className="fixed bottom-6 left-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
        <span className="text-background text-lg md:text-xl">♪</span>
      </div>

      {/* Winner Bar - right edge */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[hsl(var(--candy-pink))] w-8 md:w-10 h-32 md:h-40 rounded-l-lg flex items-center justify-center cursor-pointer hover:w-12 transition-all shadow-lg">
        <span className="font-display text-xs md:text-sm text-primary-foreground uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Winner
        </span>
      </div>
    </section>
  );
};

export default BombonHero;
