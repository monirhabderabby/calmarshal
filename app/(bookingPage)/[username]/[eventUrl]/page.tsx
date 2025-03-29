import RanderCalendar from "@/app/components/booking-form/render-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getData(username: string, eventUrl: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      user: {
        userName: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      user: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!data) notFound();

  return data;
}

const Page = async ({
  params,
}: {
  params: { username: string; eventUrl: string };
}) => {
  const data = await getData(params.username, params.eventUrl);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[1000px] w-full mx-auto">
        <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4">
          <div>
            <Image
              src={data.user?.image as string}
              alt="profile photo"
              className="size-10 rounded-full"
              width={10}
              height={10}
            />

            <p className="text-sm font-medium text-muted-foreground mt-1">
              {data.user?.name}
            </p>
            <h1 className="text-xl font-semibold mt-2 ">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground ">
              {data.description}
            </p>

            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center">
                <CalendarX2 className="size-4 mr-2 text-primary" />

                <span className="text-sm font-medium text-muted-foreground">
                  23. Sept 2024
                </span>
              </p>

              <p className="flex items-center">
                <Clock className="size-4 mr-2 text-primary" />

                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} Minutes
                </span>
              </p>
              <p className="flex items-center">
                <VideoIcon className="size-4 mr-2 text-primary" />

                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-full w-[1px]" />
          <RanderCalendar availability={data.user?.availability ?? []} />

          <Separator orientation="vertical" className="h-full w-[1px]" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
