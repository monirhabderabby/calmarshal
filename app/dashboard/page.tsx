import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
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
        <>hey we have event type</>
      )}
    </div>
  );
};

export default DashboardPage;
