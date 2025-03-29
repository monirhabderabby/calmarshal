import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import {
  ExternalLink,
  Link2,
  Pen,
  Settings,
  Trash,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyState from "../components/empty-state";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
      eventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
      },
    },
  });

  if (!data) notFound();

  return data;
}

const DashboardPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <div className="h-full">
      {data.eventType.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking button below"
          buttonText="Add event type"
          href="/dashboard/new"
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden md:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Event types
              </h1>
              <p className="text-muted-foreground">
                Create and manage your event types right here
              </p>
            </div>

            <div>
              <Button asChild>
                <Link href="/dashboard/new">Create new Event</Link>
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 lg:grid-cols-4 mt-5">
            {data.eventType.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden shadow rounded-lg border relative"
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Event</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${data.userName}/${item.url}`}>
                            <ExternalLink className="mr-2 size-4" /> Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link2 className="mr-2 size-4" /> Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pen className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash className="size-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href="/" className="flex items-center p-5">
                  <div className="flex-shrink-0">
                    <Users2 className="size-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {item.duration} Minutes Meeting
                      </dt>
                      <dd className="text-lg font-medium">{item.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-muted px-5 py-3 flex justify-between items-center">
                  <Switch />
                  <Button>Edit Event</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
