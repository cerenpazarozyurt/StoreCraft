"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Menu, Portal, Button, Flex, Text, Breadcrumb, useBreakpointValue } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, Home, Bell } from "lucide-react";
import { navItems } from "@/lib/navigation";

export function Navbar() {
  const pathname = usePathname();
  const currentItem = navItems.find((item) => item.href === pathname);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="bg.surface" boxShadow="sm" px={{ base: "4", md: "6" }} py="3">
      <Flex justify="space-between" align="center">
        <Box maxW={{ base: "150px", sm: "full" }} overflow="hidden">
          <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="text.primary" truncate>
            {currentItem?.label ?? "StoreCraft"}
          </Text>

          {!isMobile && (
            <Breadcrumb.Root size="sm" mt="1">
              <Breadcrumb.List color="text.primary">
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <NextLink href="/dashboard">
                      <Home size={14} />
                    </NextLink>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink color="text.primary" fontWeight="medium">
                    {currentItem?.label ?? "StoreCraft"}
                  </Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          )}
        </Box>

        <Flex align="center" gap={{ base: "2", md: "4" }}>
          <Button variant="ghost" size="sm" aria-label="Bildirimler">
            <Bell size={18} />
          </Button>

          <ColorModeButton />
          <Avatar name="Ceren P." size="sm" />
        </Flex>
      </Flex>
    </Box>
  );
}