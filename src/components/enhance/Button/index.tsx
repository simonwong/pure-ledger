import React, { MouseEvent, MouseEventHandler, useState } from "react";
import {
  Button as InnerButton,
  ButtonProps as InnerButtonProps,
} from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends Omit<InnerButtonProps, "onClick"> {
  onClick?: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void>;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (onClick) {
      const clickPromise = onClick(e);

      if (clickPromise instanceof Promise) {
        setIsLoading(true);
        try {
          await clickPromise;
        } catch (e) {
          // Empty
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <InnerButton
      {...props}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </InnerButton>
  );
};

export default Button;
