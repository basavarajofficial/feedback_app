"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link"
import { User } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";
import { Suspense } from "react";

const Navbar = () => {

    const { data: session, status} = useSession();

    const user:User = session?.user as User;
  return (
    <nav className="p-4 md:p-6 shadow-md flex justify-between items-center bg-gray-800 text-white">
        <a href="#" className="font-extrabold text-2xl tracking-tight lg:text-4xl mb-2">
            <Suspense fallback="loading...">
                <Image src="/logo.png" alt="logo" width={40} height={40} className="rounded-full" />
            </Suspense>
        </a>
        {
            session ? (
                <div className="flex gap-3 items-center">
                    <span>Welcome, {user?.username || user?.email} </span>
                    <Button className="md:m-auto border" onClick={() => signOut()} >Log out</Button>
                </div>
            ) : (
                <Link href='/signIn'>
                    <Button className="md:m-auto border">Sign In</Button>
                </Link>
            )
        }
    </nav>
  )
}

export default Navbar
