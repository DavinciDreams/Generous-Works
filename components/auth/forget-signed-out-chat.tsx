"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useGenerativeUIStore } from "@/lib/store";

/**
 * Clears the conversation kept in this browser whenever nobody is signed in,
 * so the next person to sign in on a shared browser can't see it. Mounted in
 * the root layout so it runs on every page, including after sign-out.
 */
export const ForgetSignedOutChat = () => {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      useGenerativeUIStore.getState().forgetSignedOutUser();
    }
  }, [isLoaded, isSignedIn]);

  return null;
};
