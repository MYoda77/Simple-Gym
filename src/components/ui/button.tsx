import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-card hover:bg-muted hover:text-muted-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-muted hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
        glass: "bg-muted/50 text-foreground hover:bg-muted/70 backdrop-blur-sm",
      },
      size: {
        default: "h-14 px-6 py-3 text-base md:h-10 md:px-4 md:py-2 md:text-sm",
        sm: "h-12 px-4 text-base md:h-9 md:px-3 md:text-sm",
        lg: "h-16 px-8 text-lg md:h-11 md:px-8 md:text-base",
        icon: "h-14 w-14 md:h-10 md:w-10",
        workout: "h-20 px-10 text-xl font-bold md:h-14 md:px-8 md:text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
