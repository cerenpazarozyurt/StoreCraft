import { Box, Text, Flex } from "@chakra-ui/react";
import { TopProduct } from "@/lib/dashboard";
import { Award } from "lucide-react";

interface TopProductsCardProps {
  products: TopProduct[];
}

export function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" display="flex" flexDirection="column" h="100%" gap="6">
      <Flex align="center" gap="2" mb="4">
        <Award size={20} color="var(--chakra-colors-accent-500, #0D9488)" />
        <Text fontWeight="bold" color="text.primary" fontSize="lg">
          En Çok Satan Ürünler
        </Text>
      </Flex>

      <Flex direction="column" gap="3.5">
        {products.map((product, index) => (
          <Flex key={product.id} justify="space-between" align="center">
            <Flex align="center" gap="3" maxW="70%">
              <Text fontSize="sm" fontWeight="bold" color="accent.500" w="4">
                #{index + 1}
              </Text>
              <Text 
                fontSize="sm" 
                fontWeight="medium" 
                color="text.primary"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.title}
              </Text>
            </Flex>
            <Flex direction="column" align="flex-end">
              <Text fontSize="sm" fontWeight="bold" color="text.primary">
                {product.quantity} Adet
              </Text>
              <Text fontSize="xs" color="text.muted">
                ${product.price.toFixed(2)}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}