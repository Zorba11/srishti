export default function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-50 pointer-events-none mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        filter: 'contrast(120%) brightness(120%)',
        backgroundColor: 'rgba(164, 11, 90, 0.2)', // Adding pink tint
      }}
    />
  );
}
