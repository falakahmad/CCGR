import Converter from "@/components/Converter";
import GlobalLoader from "@/components/GlobalLoader";
import { Metadata } from "next";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#050505] selection:bg-yellow-200 dark:selection:bg-yellow-900/40">
      <GlobalLoader />
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 dark:bg-blue-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-100 dark:bg-yellow-900/20 blur-[100px]" />
      </div>

      <div className="relative px-6 py-12 md:py-24">
        <Converter />
      </div>
    </main>
  );
}
