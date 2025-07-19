export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    backgroundPosition: "0% 50%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    animationName: "gradient",
    animationDuration: `${animationSpeed}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    display: "inline-block",
  };

  return (
    <>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div
        className={`relative mx-auto flex max-w-fit flex-row items-center justify-center font-medium transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
        style={{ background: 'transparent' }}
      >
      {showBorder && (
        <div
          className="absolute inset-0 z-0 pointer-events-none animate-gradient"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
            backgroundSize: "300% 100%",
          }}
        >
          <div
            className="absolute inset-0 bg-transparent rounded-[1.25rem] z-[-1]"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        </div>
      )}
      <span
        className="inline-block relative z-2 animate-gradient bg-clip-text text-transparent"
        style={{
          ...gradientStyle,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
      </div>
    </>
  );
} 