import { requireUser } from "@/lib/hooks";

const DashboardPage = async () => {
  const session = await requireUser();

  console.log(session);

  return <div>Dashboard page</div>;
};

export default DashboardPage;
