"use client";
import { cn } from "@/lib/utils";
import { Children, cloneElement, ReactElement } from "react";
import { ButtonProps } from "./button";

interface Props {
  className?: string;
  children: ReactElement<ButtonProps>[];
}

const ButtonGroup = ({ className, children }: Props) => {
  const totalButtons = Children.count(children);
  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === totalButtons - 1;

        return cloneElement(child, {
          className: cn(child.props.className, {
            "rounded-l-none": !isFirstItem,
            "rounded-r-none": !isLastItem,
            "border-l-0": !isFirstItem,
          }),
        });
      })}
    </div>
  );
};

export default ButtonGroup;
