"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getSignedinDevices = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "unauthorized"}
  }
  const devices = await db.deviceSession.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      lastUsed: "desc",
    },
    select: {
      id: true,
      sessionToken: true,
      userAgent: true,
      ip: true,
      createdAt: true,
      lastUsed: true,
    },
  });
  const currentSessionToken = session.user.sessionToken

  const devicesWithIsCurrent = devices.map((device) => ({
    ...device,
    isCurrent: device.sessionToken === currentSessionToken,
  }));

  return devicesWithIsCurrent;
};
