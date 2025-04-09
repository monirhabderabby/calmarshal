"use client";

import { CreateEvent } from "@/app/actions";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

const Page = () => {
  const [pending, startTransition] = React.useTransition();

  const onCreate = () => {
    startTransition(() => {
      CreateEvent().then((res) => {
        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success("Event created successfully");
      });
    });
  };
  return (
    <div>
      <Button onClick={onCreate} disabled={pending}>
        Create Event
      </Button>
    </div>
  );
};

export default Page;
