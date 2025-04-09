"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import {
  eventTypeSchema,
  onboardingSchemaValidation,
  settingsSchema,
} from "@/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onboardingAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            userName: formData.get("userName") as string,
          },
        });

        return !existingUsername;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      userName: submission.value.userName,
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Wednesday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Thursday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Friday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Sunday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function SettingsAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard");
}

export async function updateAvailability(formData: FormData) {
  await requireUser();

  const rowData = Object.fromEntries(formData.entries());

  const availabilityData = Object.keys(rowData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");

      return {
        id,
        isActive: rowData[`isActive-${id}`] === "on",
        fromTime: rowData[`fromTime-${id}`] as string,
        tillTime: rowData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: {
            id: item.id,
          },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.log(error);
  }
}

export async function CreateEventTypeAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard");
}

export async function CreateEvent() {
  const session = await requireUser();

  if (!session.user?.id) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const user = await nylas.events.create({
    identifier: "19d6d262-e05b-400b-b9fa-afcfec28c438",
    requestBody: {
      title: "Test Event From Next.js Project",
      description: "Test Event Description",
      when: {
        startTime: Math.floor(new Date().getTime() / 1000),
        endTime: Math.floor(new Date().getTime() / 1000) + 60 * 60,
      },
      conferencing: {
        autocreate: {},
        provider: "Google Meet",
      },
      participants: [
        {
          name: "Test User",
          email: "monir.bdcalling@gmail.com",
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: "monirhrabby.personal@gmail.com",
      notifyParticipants: true,
    },
  });

  return {
    success: true,
    message: "Event created successfully",
    data: user,
  };
}
