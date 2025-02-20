import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

function UnAuthenticatedSidebar() {
  return (
    <div className="box-border size-320 border-2 p-4 rounded-lg">
        <div className="text-center">
            <p className="text-xl font-semibold">Welcome Back!</p>
            <p className="text-sm">Login to access your profile and connect with others.</p>
        </div>
      <div className="m-4">
        <SignInButton mode="modal">
          <Button variant="secondary" className="w-full">
            Log in
          </Button>
        </SignInButton>
      </div>
      <div className="m-4">
        <SignUpButton mode="modal">
          <Button variant="default" className="w-full">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    </div>
  );
}

export default UnAuthenticatedSidebar;
