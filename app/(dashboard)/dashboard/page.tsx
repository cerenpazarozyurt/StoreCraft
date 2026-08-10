"use client";

import { Box, Flex, Text, Grid, Center, Spinner } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RecentOrdersCard } from "@/components/RecentOrdersCard";
import { TopProductsCard } from "@/components/TopProductsCard";
import { useDashboard } from "@/hooks/useDashboard";
import { getCategoryLabel } from "@/lib/categoryLabels";

export default function DashboardPage() {
  const {
    categoryComparison,
    criticalStockCount,
    totalRevenue,
    totalSold,
    avgCartValue,
    brandStats,
    categories,
    orders,
    topProducts,
    selectedCategory,
    setSelectedCategory,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return (
      <Center h="80vh">
        <Spinner size="xl" color="accent.500" borderWidth="4px" />
      </Center>
    );
  }

  const categoryChartOptions: Highcharts.Options = {
    chart: { type: "column", backgroundColor: "transparent" },
    title: { text: undefined },
    xAxis: { categories: categoryComparison.map((c) => getCategoryLabel(c.category)) },
    yAxis: [
      { title: { text: "Ort. Fiyat ($)" } },
      { title: { text: "Ort. Stok" }, opposite: true },
    ],
    series: [
      { name: "Ort. Fiyat", type: "column", yAxis: 0, data: categoryComparison.map((c) => c.avgPrice), color: "#0D9488" },
      { name: "Ort. Stok", type: "column", yAxis: 1, data: categoryComparison.map((c) => c.avgStock), color: "#1B2A4A" },
    ],
    credits: { enabled: false },
  };

  const brandChartOptions: Highcharts.Options = {
    chart: { type: "pie", backgroundColor: "transparent", animation: false },
    title: { text: undefined },
    plotOptions: {
      pie: {
        animation: false,
      },
    },
    series: [
      {
        name: "Satış Adedi",
        type: "pie",
        data: brandStats.map((b) => ({ name: b.brand, y: b.quantity })),
      },
    ],
    credits: { enabled: false },
  };

  return (
    <Box p={{ base: "4", md: "8" }} maxW="1400px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" color="text.primary" mb="6">
        Dashboard
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap="6" mb="8">
        <StatCard label="Toplam Mağaza Cirosu" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Toplam Satılan Ürün" value={totalSold.toLocaleString()} icon={ShoppingBag} />
        <StatCard label="Ortalama Sepet Tutarı" value={`$${avgCartValue.toFixed(2)}`} icon={TrendingUp} />
        <StatCard label="Kritik Stoktaki Ürünler" value={criticalStockCount.toString()} icon={AlertTriangle} />
      </Grid>

      <Grid 
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
        templateRows={{ lg: "auto auto" }} 
        gap="6"
      >
        <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" gridColumn="1" gridRow="1">
          <Text fontWeight="bold" mb="4" color="text.primary">
            Kategoriye Göre Fiyat & Stok Karşılaştırması
          </Text>
          <HighchartsReact highcharts={Highcharts} options={categoryChartOptions} />
        </Box>

        <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" gridColumn="2" gridRow="1" h="100%">
          <TopProductsCard products={topProducts} />
        </Box>

        <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" gridColumn="1" gridRow="2">
          <Flex justify="space-between" align="center" mb="4">
            <Text fontWeight="bold" color="text.primary">
              İlk 5 Marka (Satış Payı)
            </Text>
            
            <select
              style={{
                maxWidth: "200px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--chakra-colors-border-default, #e2e8f0)",
                backgroundColor: "var(--chakra-colors-bg-surface, #ffffff)",
                color: "var(--chakra-colors-text-primary, #1B2A4A)",
                colorScheme: "light dark",
                fontSize: "14px",
                outline: "none",
              }}
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </Flex>
          <HighchartsReact highcharts={Highcharts} options={brandChartOptions} />
        </Box>

        <Box bg="bg.surface" p="6" borderRadius="lg" boxShadow="sm" gridColumn="2" gridRow="2" h="100%">
          <RecentOrdersCard orders={orders} />
        </Box>
      </Grid>
    </Box>
  );
}