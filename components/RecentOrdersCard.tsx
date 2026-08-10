"use client";

import { Box, Flex, Text, Badge, Image, VStack } from "@chakra-ui/react";
import { Order } from "@/lib/orders"; 

interface RecentOrdersCardProps {
  orders: Order[];
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5); //id no larına göre büyükten küçüğe sırala

  return (
    <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" h="100%">
      <Text fontWeight="bold" fontSize="lg" color="text.primary" mb="4">
        Son Siparişler (Recent Orders)
      </Text>
      <VStack gap="4" align="stretch">
        {recentOrders.map((order) => {
          const firstProduct = order.products[0];
          const status = order.status;

          return (
            <Box key={order.id}>
              <Flex align="center" justify="space-between">
                <Flex align="center" gap="3">
                  {firstProduct?.thumbnail && (
                    <Image
                      src={firstProduct.thumbnail}
                      alt={firstProduct.title}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border.default"
                    />
                  )}
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="text.primary" truncate maxW="150px">
                      {firstProduct?.title || `Sipariş #${order.id}`}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      ${order.discountedTotal.toLocaleString()} × {order.totalQuantity}
                    </Text>
                  </Box>
                </Flex>
                <Badge
                  colorPalette={
                    status === "Completed" ? "green" : 
                    status === "In-Progress" ? "blue" : "orange"
                  }
                  variant="subtle"
                  px="2"
                  py="1"
                  borderRadius="full"
                  fontSize="xs"
                >
                  {status}
                </Badge>
              </Flex>
              <Box mt="3" borderBottom="1px solid" borderColor="border.default" opacity={0.4} />
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}