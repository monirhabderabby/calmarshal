import { Button } from "@/components/ui/button";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

const CalendarButton = (
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  }
) => {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      disabled={props.isDisabled}
      {...mergeProps(buttonProps, focusProps)}
    >
      {props.children}
    </Button>
  );
};

export default CalendarButton;
