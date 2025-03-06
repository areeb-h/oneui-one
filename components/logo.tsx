import { FC } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} mr-2`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
      </svg>
      <span className="font-bold text-xl">OneUI</span>
    </div>
  );
};
