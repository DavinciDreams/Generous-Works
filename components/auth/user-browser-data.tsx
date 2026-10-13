"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setArtifactOwner, useGenerativeUIStore } from "@/lib/store";

/**
 * Ties what this browser keeps to the signed-in user: loads their saved
 * artifacts, and clears the conversation whenever nobody is signed in, so the
 * next person to sign in on a shared browser can't see either. Mounted in the
 * root layout so it runs on every page, including after sign-out.
 */
export const UserBrowserData = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && userId) void setArtifactOwner(userId);
    else useGenerativeUIStore.getState().forgetSignedOutUser();
  }, [isLoaded, isSignedIn, userId]);

  return null;
};
