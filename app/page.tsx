import Hero from "@/components/Hero";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <Hero firstName={firstName} />
    </div>
  );
}
