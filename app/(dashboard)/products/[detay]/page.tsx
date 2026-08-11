"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/products";
import { Box, Text, Image, Badge, Button, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { getCategoryLabel } from "@/lib/categoryLabels";
import { useState, useEffect } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.detay);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  if (isLoading) {
    return <Text p="10" textAlign="center">Ürün detayları yükleniyor...</Text>;
  }

  if (isError || !product) {
    return <Text p="10" textAlign="center" color="red.500">Ürün yüklenirken bir hata oluştu.</Text>;
  }

  return (
    <Box p={{ base: "4", md: "8" }} maxW="1200px" mx="auto">
      <Button variant="outline" size="sm" mb="6" onClick={() => router.back()}>
        <ArrowLeft size={16} /> Ürünlere Dön
      </Button>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="8" bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm" mb="8">
        <VStack gap="4" align="stretch">
          <Box 
            h="350px" 
            w="100%" 
            borderRadius="lg" 
            bg="bg.muted" 
            overflow="hidden" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            boxShadow="md"
          >
            <Image 
              src={selectedImage || product.thumbnail} 
              alt={product.title} 
              maxH="100%" 
              maxW="100%" 
              objectFit="contain" 
            />
          </Box>

          <HStack overflowX="auto" gap="2" py="2">
            {product.images?.map((img, idx) => {
              const isSelected = selectedImage === img;
              return (
                <Box
                  key={idx}
                  boxSize="70px"
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  border="2px solid"
                  borderColor={isSelected ? "blue.500" : "border.default"}
                  bg="bg.muted"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => setSelectedImage(img)}
                  transition="all 0.2s"
                  _hover={{ opacity: 0.8 }}
                >
                  <Image 
                    src={img} 
                    alt="" 
                    maxH="100%" 
                    maxW="100%" 
                    objectFit="contain" 
                  />
                </Box>
              );
            })}
          </HStack>
        </VStack>

        <VStack align="start" gap="4">
          <Badge variant="surface" colorPalette="blue">{getCategoryLabel(product.category)}</Badge>
          <Text fontSize="3xl" fontWeight="bold" color="text.primary">{product.title}</Text>
          
          <HStack gap="2">
            <Star size={18} fill="#ECC94B" color="#ECC94B" />
            <Text fontWeight="bold">{product.rating} / 5.0</Text>
          </HStack>

          <Text fontSize="2xl" fontWeight="bold" color="green.600">${product.price.toLocaleString()}</Text>
          
          <Text color="text.muted" lineHeight="tall">{product.description}</Text>

          <Box pt="4" borderTop="1px solid" borderColor="border.default" w="100%">
            <Text fontSize="sm" fontWeight="bold" mb="2">Stok Durumu:</Text>
            <Badge colorPalette={product.stock > 0 ? "green" : "red"}>
              {product.stock > 0 ? `Stokta Var (${product.stock} adet)` : "Tükendi"}
            </Badge>
          </Box>

          <VStack align="start" gap="2" pt="2" fontSize="sm" color="text.muted">
            <HStack><Truck size={16} /><Text>{product.shippingInformation}</Text></HStack>
            <HStack><ShieldCheck size={16} /><Text>{product.warrantyInformation}</Text></HStack>
            <HStack><RefreshCw size={16} /><Text>{product.returnPolicy}</Text></HStack>
          </VStack>
        </VStack>
      </SimpleGrid>

      <Box bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm">
        <Text fontSize="xl" fontWeight="bold" mb="4">Müşteri Yorumları ({product.reviews?.length || 0})</Text>
        <VStack gap="4" align="stretch">
          {product.reviews?.map((review, index) => (
            <Box key={index} p="4" bg="bg.muted" borderRadius="md">
              <HStack justify="space-between" mb="1">
                <Text fontWeight="bold" fontSize="sm">{review.reviewerName}</Text>
                <HStack>
                  <Star size={14} fill="#ECC94B" color="#ECC94B" />
                  <Text fontSize="sm">{review.rating}</Text>
                </HStack>
              </HStack>
              <Text fontSize="sm" color="text.muted">{review.comment}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}