import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

interface FloatingImageButtonProps {
  imageSrc: string;
  alt?: string;
  onClick?: () => void;
  asChild?: boolean;
}

export const FloatingImageButton: React.FC<FloatingImageButtonProps> = ({
  imageSrc,
  alt = "Floating Button",
  onClick,
  asChild = false,
}) => {
  const Comp = asChild ? Slot : "button";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Comp
        onClick={onClick}
        className="rounded-full shadow-xl cursor-pointer transition-transform hover:scale-105"
      >
        <img
          src={imageSrc}
          alt={alt}
          className="w-16 h-16 rounded-full object-cover"
        />
      </Comp>
    </div>
  );
};
