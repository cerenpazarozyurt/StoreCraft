import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box bg="bg.canvas" h="100dvh" w="100vw">
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </Box>
  );
}