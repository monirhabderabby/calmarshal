"use client";
import { CreateEventTypeAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/submit-buttons";
import { Button } from "@/components/ui/button";
import ButtonGroup from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventTypeSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

const Page = () => {
  const [activePlatform, setActivePlatform] =
    useState<VideoCallProvider>("Google Meet");
  const [lastResult, action] = useFormState(CreateEventTypeAction, undefined);

  const [form, field] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: eventTypeSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center ">
      <Card>
        <CardHeader>
          <CardTitle>Add new appoinment type</CardTitle>
          <CardDescription>
            Craete new appoinment type that allow people to book you!
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="grid gap-y-2">
              <Label>Title</Label>
              <Input
                placeholder="30 minute meeting"
                name={field.title.name}
                key={field.title.key}
                defaultValue={field.title.initialValue}
              />
              <p className="text-red-500 text-sm">{field.title.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
                  CalMarshal.com/
                </span>
                <Input
                  placeholder="example-url-1"
                  className="rounded-l-none"
                  name={field.url.name}
                  key={field.url.key}
                  defaultValue={field.url.initialValue}
                />
              </div>
              <p className="text-red-500 text-sm">{field.url.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Meet me in this meeting to meet me"
                name={field.description.name}
                key={field.description.key}
                defaultValue={field.description.initialValue}
              />
              <p className="text-red-500 text-sm">{field.description.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Duration</Label>
              <Select
                name={field.duration.name}
                key={field.duration.key}
                defaultValue={field.duration.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select durations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 Mins</SelectItem>
                    <SelectItem value="30">30 Mins</SelectItem>
                    <SelectItem value="45">45 Mins</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{field.duration.errors}</p>
            </div>

            <div className="grid gap-y-2">
              <Label>Video Call Provider</Label>
              <input
                type="hidden"
                value={activePlatform}
                name={field.videoCallSoftware.name}
              />
              <ButtonGroup>
                <Button
                  onClick={() => setActivePlatform("Zoom Meeting")}
                  className="w-full"
                  variant={
                    activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                  }
                  type="button"
                >
                  Zoom
                </Button>
                <Button
                  onClick={() => setActivePlatform("Google Meet")}
                  className="w-full"
                  variant={
                    activePlatform === "Google Meet" ? "secondary" : "outline"
                  }
                  type="button"
                >
                  Google Meet
                </Button>
                <Button
                  onClick={() => setActivePlatform("Microsoft Teams")}
                  className="w-full"
                  variant={
                    activePlatform === "Microsoft Teams"
                      ? "secondary"
                      : "outline"
                  }
                  type="button"
                >
                  Microsoft team
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">
                {field.videoCallSoftware.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Create Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
