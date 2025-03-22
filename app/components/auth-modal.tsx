import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import logo from "@/public/logo.png";
import Image from "next/image";
import { GithubAuthButton, GoogleAuthButton } from "./submit-buttons";

const AuthModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button effect="gooeyLeft">Get Started today</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Image src={logo} alt="logo" className="size-10" />
          <h4 className="text-3xl font-semibold">
            Cal<span className="text-primary">Marshal</span>
          </h4>
        </DialogHeader>

        <div className="flex flex-col mt-5 gap-3">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <GoogleAuthButton />
          </form>

          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <GithubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
