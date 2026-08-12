"use client";

import {
  Dialog,
  Portal,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  Flex,
  Grid,
  Image,
  IconButton,
  Field,
  Spinner,
} from "@chakra-ui/react";
import { Search, Trash2, Plus, Minus, X, User } from "lucide-react";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { Product } from "@/lib/products";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const controlHeight = "40px";

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: controlHeight,
  padding: "0 12px",
  borderRadius: "6px",
  border: "1px solid var(--chakra-colors-border-default, #CBD5E0)",
  backgroundColor: "var(--chakra-colors-bg-surface, #ffffff)",
  color: "var(--chakra-colors-text-primary, #1B2A4A)",
  colorScheme: "light dark",
  fontSize: "14px",
  outline: "none",
};

function ProductPickerList({
  products,
  isLoading,
  onSelect,
}: {
  products: Product[];
  isLoading: boolean;
  onSelect: (product: Product) => void;
}) {
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="120px">
        <Spinner size="sm" color="accent.500" />
      </Flex>
    );
  }

  if (products.length === 0) {
    return (
      <Flex justify="center" align="center" minH="120px">
        <Text fontSize="sm" color="text.muted">
          Sonuç yok
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {products.map((product) => (
        <Flex
          key={product.id}
          align="center"
          justify="space-between"
          px="3"
          py="2.5"
          _hover={{ bg: "bg.muted" }}
          cursor="pointer"
          onClick={() => onSelect(product)}
          opacity={product.stock === 0 ? 0.45 : 1}
          borderBottom="1px solid"
          borderColor="border.default"
          _last={{ borderBottom: "none" }}
        >
          <Flex align="center" gap="2" flex="1" minW="0">
            <Image src={product.thumbnail} boxSize="28px" borderRadius="md" objectFit="cover" flexShrink={0} />
            <Text fontSize="sm" truncate>
              {product.title}
            </Text>
          </Flex>
          <HStack gap="2" flexShrink={0} ml="3">
            {product.stock === 0 && (
              <Text fontSize="xs" color="red.500">
                Stok yok
              </Text>
            )}
            <Text fontSize="sm" fontWeight="semibold">
              ${product.price}
            </Text>
          </HStack>
        </Flex>
      ))}
    </>
  );
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const {
    customerQuery,
    handleCustomerQueryChange,
    filteredCustomers,
    selectCustomer,
    clearCustomer,
    selectedCustomerId,
    categories,
    selectedCategory,
    setSelectedCategory,
    productQuery,
    handleProductQueryChange,
    productOptions,
    isLoadingProducts,
    isSearching,
    cartItems,
    addProduct,
    removeProduct,
    updateQuantity,
    total,
    submit,
    isSubmitting,
    reset,
  } = useCreateOrder();

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    submit(onClose);
  }

  const canSubmit = selectedCustomerId !== null && cartItems.length > 0;
  const showCustomerSuggestions = !selectedCustomerId && customerQuery.length > 0;
  const showProductList = isSearching || Boolean(selectedCategory);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && handleClose()} placement="center" size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.surface" maxW="640px" p="0" overflow="hidden">
            <Dialog.Header px="6" pt="5" pb="4" borderBottom="1px solid" borderColor="border.default">
              <Dialog.Title color="text.primary" fontSize="lg" fontWeight="semibold">
                Yeni Sipariş
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body px="6" py="5" maxH="68vh" overflowY="auto">
              <VStack gap="5" align="stretch">
                <Field.Root>
                  <Field.Label fontSize="sm" fontWeight="medium" mb="2">
                    Müşteri
                  </Field.Label>
                  <Box position="relative">
                    <Input
                      placeholder="Müşteri ara..."
                      value={customerQuery}
                      onChange={(e) => handleCustomerQueryChange(e.target.value)}
                      pl="9"
                      h={controlHeight}
                      bg={selectedCustomerId ? "green.50" : "bg.surface"}
                      borderColor={selectedCustomerId ? "green.300" : "border.default"}
                    />
                    <Flex position="absolute" left="3" top="0" h={controlHeight} align="center" color="text.muted">
                      <User size={16} />
                    </Flex>
                    {selectedCustomerId && (
                      <Flex position="absolute" right="1" top="0" h={controlHeight} align="center">
                        <IconButton size="xs" variant="ghost" aria-label="Temizle" onClick={clearCustomer}>
                          <X size={14} />
                        </IconButton>
                      </Flex>
                    )}
                  </Box>

                  {showCustomerSuggestions && filteredCustomers.length > 0 && (
                    <Box
                      mt="2"
                      border="1px solid"
                      borderColor="border.default"
                      borderRadius="md"
                      maxH="132px"
                      overflowY="auto"
                    >
                      {filteredCustomers.map((customer) => (
                        <Flex
                          key={customer.id}
                          align="center"
                          px="3"
                          py="2.5"
                          fontSize="sm"
                          _hover={{ bg: "bg.muted" }}
                          cursor="pointer"
                          onClick={() => selectCustomer(customer.id, customer.name)}
                        >
                          {customer.name}
                        </Flex>
                      ))}
                    </Box>
                  )}
                </Field.Root>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Ürün
                  </Text>
                  <Grid templateColumns="1fr 1fr" gap="3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Kategori</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {getCategoryLabel(cat)}
                        </option>
                      ))}
                    </select>
                    <Box position="relative">
                      <Input
                        placeholder="Ürün ara..."
                        value={productQuery}
                        onChange={(e) => handleProductQueryChange(e.target.value)}
                        pl="9"
                        h={controlHeight}
                      />
                      <Flex position="absolute" left="3" top="0" h={controlHeight} align="center" color="text.muted">
                        <Search size={16} />
                      </Flex>
                    </Box>
                  </Grid>

                  <Box
                    mt="3"
                    border="1px solid"
                    borderColor="border.default"
                    borderRadius="md"
                    minH="120px"
                    maxH="200px"
                    overflowY="auto"
                    bg={showProductList ? "bg.surface" : "bg.muted"}
                  >
                    {showProductList ? (
                      <ProductPickerList
                        products={productOptions}
                        isLoading={isLoadingProducts}
                        onSelect={addProduct}
                      />
                    ) : (
                      <Flex justify="center" align="center" minH="120px">
                        <Text fontSize="sm" color="text.muted">
                          —
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </Box>

                <Box border="1px solid" borderColor="border.default" borderRadius="md" overflow="hidden">
                  <Grid
                    templateColumns="1fr 88px 80px 32px"
                    gap="2"
                    px="3"
                    py="2"
                    bg="bg.muted"
                    fontSize="xs"
                    fontWeight="semibold"
                    color="text.muted"
                    alignItems="center"
                  >
                    <Text>Sepet</Text>
                    <Text textAlign="center">Adet</Text>
                    <Text textAlign="right">Tutar</Text>
                    <Box />
                  </Grid>

                  {cartItems.length === 0 ? (
                    <Flex justify="center" align="center" py="6">
                      <Text fontSize="sm" color="text.muted">
                        Sepet boş
                      </Text>
                    </Flex>
                  ) : (
                    cartItems.map((item) => (
                      <Grid
                        key={item.product.id}
                        templateColumns="1fr 88px 80px 32px"
                        gap="2"
                        px="3"
                        py="2.5"
                        alignItems="center"
                        borderTop="1px solid"
                        borderColor="border.default"
                      >
                        <Flex align="center" gap="2" minW="0">
                          <Image
                            src={item.product.thumbnail}
                            boxSize="28px"
                            borderRadius="md"
                            objectFit="cover"
                            flexShrink={0}
                          />
                          <Text fontSize="sm" truncate>
                            {item.product.title}
                          </Text>
                        </Flex>

                        <HStack gap="1" justify="center">
                          <IconButton
                            size="xs"
                            variant="outline"
                            aria-label="Azalt"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </IconButton>
                          <Text fontSize="sm" fontWeight="medium" minW="16px" textAlign="center">
                            {item.quantity}
                          </Text>
                          <IconButton
                            size="xs"
                            variant="outline"
                            aria-label="Artır"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </IconButton>
                        </HStack>

                        <Text fontSize="sm" fontWeight="semibold" textAlign="right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Text>

                        <IconButton
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          aria-label="Kaldır"
                          onClick={() => removeProduct(item.product.id)}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Grid>
                    ))
                  )}
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer
              px="6"
              py="4"
              borderTop="1px solid"
              borderColor="border.default"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="4"
            >
              <Box>
                <Text fontSize="xs" color="text.muted" mb="0.5">
                  Toplam
                </Text>
                <Text fontWeight="bold" fontSize="xl" color="text.primary" lineHeight="1">
                  ${total.toFixed(2)}
                </Text>
              </Box>
              <HStack gap="2">
                <Button variant="outline" onClick={handleClose} type="button">
                  İptal
                </Button>
                <Button colorPalette="accent" onClick={handleSubmit} loading={isSubmitting} disabled={!canSubmit}>
                  Oluştur
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
