"use client";

import { Button } from "@/components/ui/button";
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
import { UploadDropzone } from "@/lib/uploadthing";
import { settingsSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { SettingsAction } from "../actions";
import { SubmitButton } from "./submit-buttons";

interface iAppProps {
  fullName: string;
  email: string;
  profileImage: string;
}

const SettingsForm = ({ fullName, email, profileImage }: iAppProps) => {
  const [lastResult, action] = useFormState(SettingsAction, undefined);

  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);

  const [form, field] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings!</CardDescription>
      </CardHeader>

      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="grid gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              name={field.fullName.name}
              key={field.fullName.key}
              defaultValue={fullName}
              placeholder="Jan Marshal"
            />
            <p className="text-red-500 text-sm">{field.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input disabled defaultValue={email} placeholder="test@test.com" />
          </div>
          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            <input
              type="hidden"
              name={field.profileImage.name}
              key={field.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <Image
                  src={currentProfileImage}
                  alt="profile"
                  className="size-16 rounded-lg"
                  width={64}
                  height={64}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 "
                  onClick={handleDeleteImage}
                  type="button"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].ufsUrl);
                  toast.success("Profile image has been uploaded");
                }}
                onUploadError={(err) => {
                  toast.error(err.message, {
                    position: "top-right",
                  });
                }}
              />
            )}
            <p className="text-red-500 text-sm">{field.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
};

export default SettingsForm;
