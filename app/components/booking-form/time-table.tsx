import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { prisma } from "@/lib/db";
import { nylas } from "@/lib/nylas";
import { Prisma } from "@prisma/client";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import Link from "next/link";
import { GetFreeBusyResponse, NylasResponse } from "nylas";

const getData = async (username: string, selectedDay: Date) => {
  const currentDay = format(selectedDay, "EEEE");

  const startOfDay = new Date(selectedDay);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDay);
  endOfDay.setHours(23, 59, 59, 999);
  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      user: {
        userName: username,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      user: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.user.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.user.grantEmail as string],
    },
  });

  console.log(nylasCalendarData);

  return {
    data,
    nylasCalendarData,
  };
};

function calculateAvailableTimeSlots(
  date: string,
  dbavailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number = 30
) {
  const now = new Date();
  const availableFrom = parse(
    `${date} ${dbavailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    now
  );

  const availableTill = parse(
    `${date} ${dbavailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    now
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error

  const busySlots = nylasData.data[0].timeSlots.map((slot) => {
    return {
      start: fromUnixTime(slot.startTime),
    };
  });

  const allSlots = [];

  let currentSlot = availableFrom;

  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  const freeSlots = allSlots.map((slot) => {
    const slotEnd = addMinutes(slot, duration);

    return (
      isAfter(slotEnd, now) &&
      !busySlots.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (busy: { start: any; end: any }) =>
          !isBefore(slot, busy.start) &&
          (isBefore(slotEnd, busy.end) ||
            (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
            (isBefore(slot, busy.start) && isAfter(slot, busy.end)))
      )
    );
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return freeSlots.map((slot) => format(slot, "HH:mm"));
}
interface iAppProps {
  selectedDate: Date;
  userName: string;
}

const TimeTable = async ({ selectedDate, userName }: iAppProps) => {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dbavailability = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  };

  const availableSlots = calculateAvailableTimeSlots(
    formattedDate,
    dbavailability,
    nylasCalendarData,
    30
  );

  return (
    <div>
      <p className="text-base font-semibold ">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <ScrollArea className="mt-3 h-[350px] pr-3">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link href="/" key={index}>
              <Button className="w-full mb-2" variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No Time Slot Available</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default TimeTable;
