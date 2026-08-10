"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  helpText?: string;
}

export function StatCard({ label, value, icon: Icon, helpText }: StatCardProps) {
  return (
    <Box
      bg="bg.surface"
      p="6"
      borderRadius="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="border.default"
    >
      <Flex align="center" gap="3" mb="4">
        <Flex
          p="3"
          bg="accent.50"
          color="accent.600"
          borderRadius="lg"
          align="center"
          justify="center"
          w="40px"
          h="40px"
        >
          <Icon size={20} />
        </Flex>
        <Text fontSize="sm" fontWeight="bold" color="text.primary">
          {label}
        </Text>
      </Flex>
      <Text fontSize="2xl" fontWeight="bold" color="text.primary">
        {value}
      </Text>
      {helpText && (
        <Text fontSize="xs" color="text.muted" mt="1">
          {helpText}
        </Text>
      )}
    </Box>
  );
}