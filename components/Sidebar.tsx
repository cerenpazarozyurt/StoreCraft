"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { navItems } from "@/lib/navigation";
import { useState, useEffect } from "react";
import { PanelLeftClose } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobileScreen !== undefined) {
      setIsCollapsed(isMobileScreen);
    }
  }, [isMobileScreen]);

  return (
    <Box 
      bg="bg.surface" 
      w={isCollapsed ? "20" : "64"} 
      h="100vh" 
      p="4" 
      transition="width 0.3s ease"
      borderRight="1px solid"
      borderColor="border.default"
      position="relative"
    >
      <Flex direction="column" gap="8" h="full">
        <Flex 
          align="center" 
          justify={isCollapsed ? "center" : "space-between"} 
          px="2" 
          pt="2"
          cursor="pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Sidebar'ı Daralt/Genişlet"
        >
          {!isCollapsed && (
            <Text fontSize="xl" fontWeight="bold" color="primary.500" whiteSpace="nowrap">
              StoreCraft
            </Text>
          )}
          <Box color="text.muted" _hover={{ color: "text.primary" }}>
            <PanelLeftClose size={20} />
          </Box>
        </Flex>

        <Flex direction="column" gap="3" flex="1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <NextLink key={item.href} href={item.href}>
                <Flex
                  align="center"
                  justify={isCollapsed ? "center" : "flex-start"}
                  gap="3"
                  w="full"
                  h="48px"
                  px={isCollapsed ? "0" : "3"}
                  borderRadius="md"
                  bg={isActive ? "accent.500" : "transparent"}
                  color={isActive ? "white" : "text.primary"}
                  transition="all 0.2s"
                  _hover={{ bg: "accent.500", color: "white" }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </NextLink>
            );
          })}
        </Flex>

      </Flex>
    </Box>
  );
}