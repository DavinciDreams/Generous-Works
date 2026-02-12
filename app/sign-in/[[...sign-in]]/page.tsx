import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        afterSignInUrl="/canvas"
        afterSignUpUrl="/canvas"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border border-border rounded-xl",
          },
        }}
      />
    </div>
  );
}
