"use client";

import { Box, Flex, Text, Input, Table, Button, Image, Badge, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search, Pencil } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { CreateProductModal } from "@/components/CreateProductModal";
import { useQuery } from "@tanstack/react-query";
import { getCategoryList, Product, NewProduct } from "@/lib/products";
import { getCategoryLabel } from "@/lib/categoryLabels";

export default function ProductsPage() {
  const {
    products, total, skip, setSkip, limit, setSearch, 
    isLoading, isError, deleteProduct, isDeleting, 
    createProduct, isCreating, updateProduct, isUpdating,
    category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, inStockOnly, setInStockOnly
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["category-list"],
    queryFn: getCategoryList,
    staleTime: 1000 * 60 * 10,
  });

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: NewProduct, options?: { onSuccess?: () => void }) => {
    if (productToEdit) {
      updateProduct({ id: productToEdit.id, data }, { onSuccess: options?.onSuccess });
    } else {
      createProduct(data, { onSuccess: options?.onSuccess });
    }
  };

  return (
    <Box p={{ base: "4", md: "8" }} maxW="1400px" mx="auto">
      <Flex justify="space-between" align="center" mb="6">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="text.primary">Ürünler</Text>
          <Text fontSize="sm" color="text.muted">Toplam {total} ürün listeleniyor</Text>
        </Box>
        <Button colorPalette="blue" size="sm" onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}>
          <Plus size={16} /> Yeni Ürün Ekle
        </Button>
      </Flex>

      <Box bg="bg.surface" p="4" borderRadius="lg" mb="4" boxShadow="sm">
        <Flex gap="3" align="center" wrap="wrap">
          <Box position="relative" flex="1" minW="220px">
            <Input
              placeholder="Ürün ara..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSearch(e.target.value);
              }}
              size="sm"
              pl="8"
            />
            <Box position="absolute" left="2.5" top="2.5" color="text.muted">
              <Search size={16} />
            </Box>
          </Box>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              minWidth: "160px",
              height: "32px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid var(--chakra-colors-border-default, #CBD5E0)",
              backgroundColor: "var(--chakra-colors-bg-surface, #ffffff)",
              color: "var(--chakra-colors-text-primary, #1B2A4A)",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {getCategoryLabel(c)}
              </option>
            ))}
          </select>

          <Input
            placeholder="Min Fiyat ($)"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            size="sm"
            maxW="120px"
          />

          <Input
            placeholder="Max Fiyat ($)"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            size="sm"
            maxW="120px"
          />

          <Button
            size="sm"
            variant={inStockOnly ? "solid" : "outline"}
            colorPalette={inStockOnly ? "green" : "gray"}
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            Stokta Olanlar
          </Button>
        </Flex>
      </Box>

      <Box bg="bg.surface" borderRadius="lg" boxShadow="sm" overflow="hidden">
        {isError ? (
          <Text p="6" color="red.500" textAlign="center">Ürünler yüklenirken bir hata oluştu.</Text>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="bg.muted">
                  <Table.ColumnHeader>Ürün</Table.ColumnHeader>
                  <Table.ColumnHeader>Marka</Table.ColumnHeader>
                  <Table.ColumnHeader>Kategori</Table.ColumnHeader>
                  <Table.ColumnHeader>Fiyat</Table.ColumnHeader>
                  <Table.ColumnHeader>Stok</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right" pr="6">İşlem</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} textAlign="center" py="10">Yükleniyor...</Table.Cell>
                  </Table.Row>
                ) : products.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} textAlign="center" py="10" color="text.muted">Aradığınız kriterlere uygun ürün bulunamadı.</Table.Cell>
                  </Table.Row>
                ) : (
                  products.map((product) => (
                    <Table.Row key={product.id}>
                      <Table.Cell>
                        <Flex align="center" gap="3">
                          <Image src={product.thumbnail} alt={product.title} boxSize="40px" borderRadius="md" objectFit="cover" />
                          <Link href={`/products/${product.id}`} style={{ fontWeight: 500, textDecoration: "underline" }}>
                            {product.title}
                          </Link>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>{product.brand}</Table.Cell>
                      <Table.Cell><Badge variant="surface">{getCategoryLabel(product.category)}</Badge></Table.Cell>
                      <Table.Cell>${product.price.toLocaleString()}</Table.Cell>
                      <Table.Cell>
                        <span style={{ color: product.stock === 0 ? "red" : "inherit" }}>
                          {product.stock === 0 ? "Out of Stock" : product.stock}
                        </span>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex gap="2" justify="flex-end" align="center">
                          <Button size="xs" variant="outline" colorPalette="blue" onClick={() => handleEdit(product)} title="Düzenle">
                            <Pencil size={14} />
                          </Button>
                          <Button size="xs" variant="outline" colorPalette="red" onClick={() => setProductToDelete(product.id)} title="Sil">
                            Sil
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        )}

        <Flex justify="flex-end" align="center" gap="2" p="4" borderTop="1px solid" borderColor="border.default">
          <Button size="sm" variant="outline" disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
            <ChevronLeft size={16} /> Önceki
          </Button>
          <Text fontSize="sm" px="2">Sayfa {currentPage} / {totalPages}</Text>
          <Button size="sm" variant="outline" disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
            Sonraki <ChevronRight size={16} />
          </Button>
        </Flex>
      </Box>

      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setProductToEdit(null); }} 
        onSubmitData={handleSubmit} 
        isPending={isCreating || isUpdating}
        productToEdit={productToEdit}
      />

      <Dialog.Root open={productToDelete !== null} onOpenChange={(details) => !details.open && setProductToDelete(null)} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="bg.surface" maxW="400px">
              <Dialog.Header>
                <Dialog.Title color="text.primary">Emin misiniz?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="text.muted">Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setProductToDelete(null)}>Vazgeç</Button>
                <Button colorPalette="red" onClick={() => { if (productToDelete !== null) { deleteProduct(productToDelete); setProductToDelete(null); }}} loading={isDeleting}>
                  Evet, Sil
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}