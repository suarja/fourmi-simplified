import { SignIn } from "@clerk/clerk-react";

export function SignInForm() {
  return (
    <div className="w-full flex justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "w-full shadow-none bg-transparent",
          }
        }}
      />
    </div>
  );
}
