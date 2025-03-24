import { updateAvailability } from "@/app/actions";
import { SubmitButton } from "@/app/components/submit-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { times } from "@/lib/times";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: id,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const Page = async () => {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          In this section you can manage your availibility
        </CardDescription>
      </CardHeader>

      <form action={updateAvailability}>
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  defaultChecked={item.isActive}
                  name={`isActive-${item.id}`}
                />
                <p>{item.day}</p>
              </div>

              <Select defaultValue={item.fromTime} name={`fromTime-${item.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="From Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map(({ id, time }) => (
                      <SelectItem key={id} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue={item.tillTime} name={`tillTime-${item.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Till Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map(({ id, time }) => (
                      <SelectItem key={id} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
};

export default Page;
