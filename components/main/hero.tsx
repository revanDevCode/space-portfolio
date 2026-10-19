import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">

      {/* Bintang-bintang */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="stars"></div>
      </div>

      {/* Black Hole */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="rotate-180 absolute top-0 left-0 w-full h-full min-h-screen object-cover z-0 pointer-events-none"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      {/* Konten */}
      <div className="relative z-10 w-full">
        <HeroContent />
      </div>

    </div>
  );
};