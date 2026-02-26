import { auth, signOut } from "@/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const session = await auth();
    const user = session?.user
        ? {
            name: session.user.name ?? null,
            email: session.user.email ?? null,
            image: session.user.image ?? null,
        }
        : null;

    async function handleSignOut() {
        "use server";
        await signOut({ redirectTo: "/login" });
    }

    return <NavbarClient user={user} signOutAction={handleSignOut} />;
}
