import Image from "next/image";
import Link from "next/link";
import AuthModal from "./auth-modal";

export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between ">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h1 className="text-3xl font-semibold">
          <span className="text-blue-500">CalMarshal</span>
        </h1>
      </Link>

      <AuthModal />
    </div>
  );
}
