"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Menu, Portal, Button, Flex, Text, Breadcrumb, useBreakpointValue, Spinner, VStack, Popover, Badge, HStack, Checkbox } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, Home, Bell } from "lucide-react";
import { navItems } from "@/lib/navigation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTodos } from "@/hooks/useTodos";

export function Navbar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentItem = navItems.find((item) => item.href === pathname);
  const { data: currentUser } = useCurrentUser();
  const { todos, toggleTodo, incompleteCount, isLoading } = useTodos();

  const isMobile = useBreakpointValue({ base: true, md: false });

  function handleLogout() {
    setIsLoggingOut(true);
    Cookies.remove("accessToken");
    router.push("/login");
  }

  return (
    <>
      {isLoggingOut && (
        <Box
          position="fixed"
          inset="0"
          bg="blackAlpha.600"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={3}>
            <Spinner size="xl" color="white" />
            <Text color="white" fontWeight="medium">
              Çıkış yapılıyor...
            </Text>
          </VStack>
        </Box>
      )}

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
          <Popover.Root positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger asChild>
              <Box position="relative" cursor="pointer">
                <Button variant="ghost" size="sm" aria-label="Bildirimler">
                  <Bell size={18} />
                </Button>
                {incompleteCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorPalette="red"
                    borderRadius="full"
                    fontSize="2xs"
                    px="1.5"
                    minW="18px"
                    textAlign="center"
                  >
                    {incompleteCount}
                  </Badge>
                )}
              </Box>
            </Popover.Trigger>

            <Portal>
              <Popover.Positioner>
                <Popover.Content bg="bg.surface" w="320px" maxH="400px" overflowY="auto">
                  <Popover.Body>
                    <Text fontWeight="bold" mb="3" color="text.primary">
                      Görevler ({incompleteCount} bekliyor)
                    </Text>

                    {isLoading ? (
                      <Text fontSize="sm" color="text.muted">Yükleniyor...</Text>
                    ) : (
                      <VStack align="stretch" gap="2">
                        {todos.map((todo) => (
                          <HStack key={todo.id} gap="2" align="start">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                              style={{ marginTop: "4px", cursor: "pointer" }}
                            />
                            <Text
                              fontSize="sm"
                              color={todo.completed ? "text.muted" : "text.primary"}
                              textDecoration={todo.completed ? "line-through" : "none"}
                            >
                              {todo.todo}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    )}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          <ColorModeButton />
          <Menu.Root
            onSelect={(details) => {
              if (details.value === "logout") {
                Cookies.remove("accessToken");
                router.push("/login");
              }
              if (details.value === "profile") {
                router.push("/profile");
              }
            }}
          >
            <Menu.Trigger asChild>
              <Button variant="plain" size="sm" p={0}>
                <Avatar
                  name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : undefined}
                  src={currentUser?.image}
                  size="sm"
                  cursor="pointer"
                />
              </Button>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile">Profilim</Menu.Item>
                  <Menu.Item value="logout" color="red.500">
                    Çıkış Yap
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>
    </Box>
    </>
  );
}