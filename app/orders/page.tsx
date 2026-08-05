"use client";

import { useState } from "react";
import { Box, Flex, Text, Input, Button, Table, Badge, Stack, Skeleton } from "@chakra-ui/react";
import { Search, Plus, ChevronLeft, ChevronRight, ShoppingBag, Filter as FilterIcon, X } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const {
    orders,
    total,
    totalRevenue,
    pendingCount,
    inProgressCount,
    completedCount,
    isLoading,
    isError,
    inputValue,
    handleSearchChange,
    skip,
    setSkip,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
  } = useOrders();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getStatusBadge = (status: "Completed" | "In-Progress" | "Pending") => {
    switch (status) {
      case "Completed":
        return <Badge colorPalette="green" variant="subtle">Completed</Badge>;
      case "In-Progress":
        return <Badge colorPalette="blue" variant="subtle">In-Progress</Badge>;
      case "Pending":
        return <Badge colorPalette="orange" variant="subtle">Pending</Badge>;
    }
  };

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <Box p={{ base: "4", md: "8" }} maxW="1400px" mx="auto">

      <Flex justify="space-between" align="center" mb="6">
        <Text fontSize="2xl" fontWeight="bold" color="text.primary">
          Orders Summary
        </Text>
        <Button colorPalette="blue" size="sm">
          <Plus size={16} /> Create a New Order
        </Button>
      </Flex>

      <Flex gap="6" mb="8" direction={{ base: "column", md: "row" }}>
        
        <Box bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm" flex="1" border="1px solid" borderColor="border.default" display="flex" flexDirection="column" justifyContent="space-between">
          <Flex justify="space-between" align="center" mb="4">
            <Flex align="center" gap="3">
              <Flex p="3" bg="green.subtle" color="green.600" borderRadius="lg" align="center" justify="center" w="40px" h="40px">
                <ShoppingBag size={20} />
              </Flex>
              <Text fontSize="sm" fontWeight="bold" color="text.primary">Total Revenue</Text>
            </Flex>
          </Flex>

          <Box>
            <Text fontSize="3xl" fontWeight="medium" color="text.primary" mb="1">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text fontSize="xs" color="text.muted">Calculated across all store orders & discounts</Text>
          </Box>
        </Box>

        <Box bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm" flex="1" border="1px solid" borderColor="border.default" display="flex" flexDirection="column" justifyContent="space-between">
          <Flex justify="space-between" align="center" mb="4">
            <Flex align="center" gap="3">
              <Flex p="3" bg="blue.subtle" color="blue.500" borderRadius="lg" align="center" justify="center" w="40px" h="40px">
                <ShoppingBag size={20} />
              </Flex>
              <Text fontSize="sm" fontWeight="bold" color="text.primary">Order Status Overview</Text>
            </Flex>
          </Flex>

          <Flex justify="space-between" align="flex-end">
            <Box>
              <Text fontSize="xs" color="text.muted" mb="1">All Orders</Text>
              <Text fontSize="xl" fontWeight="bold" color="text.primary">{total}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="text.muted" mb="1">Pending</Text>
              <Text fontSize="xl" fontWeight="bold" color="orange.500">{pendingCount}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="text.muted" mb="1">In-Progress</Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.500">{inProgressCount}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="text.muted" mb="1">Completed</Text>
              <Text fontSize="xl" fontWeight="bold" color="green.500">{completedCount}</Text>
            </Box>
          </Flex>
        </Box>

      </Flex>

      <Box bg="bg.surface" borderRadius="lg" boxShadow="sm" overflow="hidden">

        <Flex justify="space-between" align="center" p="4" borderBottom="1px solid" borderColor="border.default" wrap="wrap" gap="3">
          <Text fontWeight="bold" fontSize="lg" color="text.primary">Customer Orders</Text>
          
          <Flex align="center" gap="3" w={{ base: "full", md: "auto" }}>
            <Box position="relative" w={{ base: "full", md: "280px" }}>
              <Input
                placeholder="Search by customer name..."
                value={inputValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                size="sm"
                pl="8"
              />
              <Box position="absolute" left="2.5" top="2.5" color="text.muted">
                <Search size={16} />
              </Box>
            </Box>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              colorPalette={statusFilter !== "All" || minAmount || maxAmount ? "blue" : "gray"}
            >
              <FilterIcon size={16} /> Filter
            </Button>
          </Flex>
        </Flex>

        {isFilterOpen && (
          <Box p="4" bg="bg.muted" borderBottom="1px solid" borderColor="border.default">
            <Flex justify="space-between" align="center" mb="3">
              <Text fontSize="sm" fontWeight="bold">Filter Orders</Text>
              <Button size="xs" variant="ghost" onClick={() => setIsFilterOpen(false)}>
                <X size={16} />
              </Button>
            </Flex>

            <Flex gap="4" wrap="wrap" align="flex-end">
              
              <Box flex="1" minW="180px">
                <Text fontSize="xs" fontWeight="semibold" mb="1" color="text.muted">Status</Text>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--chakra-colors-border-default)",
                    background: "var(--chakra-colors-bg-surface)",
                    fontSize: "14px"
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </Box>

              <Box flex="1" minW="140px">
                <Text fontSize="xs" fontWeight="semibold" mb="1" color="text.muted">Min Amount ($)</Text>
                <Input
                  size="sm"
                  placeholder="0.00"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  bg="bg.surface"
                />
              </Box>

              <Box flex="1" minW="140px">
                <Text fontSize="xs" fontWeight="semibold" mb="1" color="text.muted">Max Amount ($)</Text>
                <Input
                  size="sm"
                  placeholder="10000.00"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  bg="bg.surface"
                />
              </Box>

              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  setStatusFilter("All");
                  setMinAmount("");
                  setMaxAmount("");
                }}
              >
                Reset Filters
              </Button>

            </Flex>
          </Box>
        )}

        {isError ? (
          <Text p="6" color="red.500" textAlign="center">Siparişler yüklenirken bir hata oluştu.</Text>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm" interactive>
              <Table.Header>
                <Table.Row bg="bg.muted" _dark={{ bg: "bg.subtle" }}>
                  <Table.ColumnHeader py="4" fontWeight="bold" color="text.primary">Customer Name</Table.ColumnHeader>
                  <Table.ColumnHeader py="4" fontWeight="bold" color="text.primary">Tracking ID / Date</Table.ColumnHeader>
                  <Table.ColumnHeader py="4" fontWeight="bold" color="text.primary">Total Products</Table.ColumnHeader>
                  <Table.ColumnHeader py="4" fontWeight="bold" color="text.primary">Order Total & Discount</Table.ColumnHeader>
                  <Table.ColumnHeader py="4" fontWeight="bold" color="text.primary">Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell><Skeleton height="20px" width="120px" /></Table.Cell>
                      <Table.Cell><Skeleton height="20px" width="100px" /></Table.Cell>
                      <Table.Cell><Skeleton height="20px" width="90px" /></Table.Cell>
                      <Table.Cell><Skeleton height="20px" width="70px" /></Table.Cell>
                      <Table.Cell><Skeleton height="20px" width="80px" /></Table.Cell>
                    </Table.Row>
                  ))
                ) : orders.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} textAlign="center" py="10">
                      <Text color="text.muted">Kriterlere uygun sipariş bulunamadı.</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  orders.map((order) => (
                    <Table.Row key={order.id}>
                      <Table.Cell fontWeight="medium">{order.customerName}</Table.Cell>
                      <Table.Cell>
                        <Stack gap="0">
                          <Text fontSize="xs" fontWeight="semibold" color="text.primary">TRK-9348-{order.id}</Text>
                          <Text fontSize="2xs" color="text.muted">12 Aug 2026 - 12:25</Text>
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="surface" size="sm">{order.totalQuantity} items ({order.totalProducts} unique)</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Stack gap="0">
                          <Text fontWeight="semibold" color="text.primary">${order.discountedTotal.toLocaleString()}</Text>
                          {order.total !== order.discountedTotal && (
                            <Text fontSize="2xs" color="text.muted" textDecoration="line-through">${order.total.toLocaleString()}</Text>
                          )}
                        </Stack>
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(order.status)}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        )}

        <Flex justify="space-between" align="center" p="4" borderTop="1px solid" borderColor="border.default">
          <Flex align="center" gap="3">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setSkip(0);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid var(--chakra-colors-border-default)",
                background: "transparent",
                fontSize: "14px"
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <Text fontSize="sm" color="text.muted">
              Showing {skip + 1} - {Math.min(skip + limit, total)} of {total} items
            </Text>
          </Flex>

          <Flex align="center" gap="2">
            <Button size="sm" variant="outline" disabled={skip === 0 || isLoading} onClick={() => setSkip(Math.max(0, skip - limit))}>
              <ChevronLeft size={16} /> Önceki
            </Button>
            <Text fontSize="sm" fontWeight="medium" px="2">
              Sayfa {currentPage} / {totalPages}
            </Text>
            <Button size="sm" variant="outline" disabled={skip + limit >= total || isLoading} onClick={() => setSkip(skip + limit)}>
              Sonraki <ChevronRight size={16} />
            </Button>
          </Flex>
        </Flex>

      </Box>
    </Box>
  );
}