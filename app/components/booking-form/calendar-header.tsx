import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { type AriaButtonProps } from "@react-types/button";
import { DOMAttributes, FocusableElement } from "@react-types/shared";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CalendarState } from "react-stately";
import CalendarButton from "./calendar-button";

const CalendarHeader = ({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}: {
  state: CalendarState;
  calendarProps: DOMAttributes<FocusableElement>;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
}) => {
  const monthDateFormatter = useDateFormatter({
    month: "short",
    year: "numeric",
    timeZone: state.timeZone,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [monthName, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((part) => part.value);
  return (
    <div className="flex items-center pb-4">
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>

      <h2 className="font-semibold flex-1">
        {monthName}{" "}
        <span className="text-muted-foreground font-medium text-sm">
          {year}
        </span>
      </h2>

      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeft className="size-4" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRight className="size-4" />
        </CalendarButton>
      </div>
    </div>
  );
};

export default CalendarHeader;
