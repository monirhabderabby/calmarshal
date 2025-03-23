import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          In this section you can manage your availibility
        </CardDescription>
      </CardHeader>

      <form>
        <CardContent></CardContent>
      </form>
    </Card>
  );
};

export default Page;
