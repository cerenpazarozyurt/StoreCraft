"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateUser } from "@/lib/user";
import { userProfileSchema, UserProfileFormValues } from "@/lib/validations/user";
import { Box, Flex, Text, Input, Button, VStack, Image, SimpleGrid } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: getCurrentUser,
    enabled: mounted,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        age: user.age?.toString() || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateUser(user!.id, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth-me"], updatedUser);
      toaster.create({
        title: "Başarılı!",
        description: "Profil bilgileriniz güncellendi.",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Hata!",
        description: "Güncelleme sırasında bir sorun oluştu.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: UserProfileFormValues) => {
    updateMutation.mutate(data);
  };

  if (!mounted || isLoading) {
    return <Text p="10" textAlign="center">Profil yükleniyor...</Text>;
  }

  return (
    <Box p={{ base: "4", md: "8" }} maxW="1000px" mx="auto">
      <Box mb="6">
        <Text fontSize="2xl" fontWeight="bold" color="text.primary">Profil ve Ayarlar</Text>
        <Text fontSize="sm" color="text.muted">Kişisel bilgilerinizi ve adres detaylarınızı buradan yönetebilirsiniz.</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
        <Box bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm" textAlign="center" h="fit-content">
          <Image
            src={user?.image || "https://bit.ly/dan-abramov"}
            alt={`${user?.firstName} ${user?.lastName}`}
            boxSize="100px"
            borderRadius="full"
            mx="auto"
            mb="4"
            objectFit="cover"
            boxShadow="md"
          />
          <Text fontSize="lg" fontWeight="bold" color="text.primary">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text fontSize="sm" color="text.muted" mb="4">@{user?.username}</Text>
          <Flex align="center" justify="center" gap="2" bg="bg.muted" p="2" borderRadius="md" fontSize="xs" color="text.muted">
            <Shield size={14} />
            <Text>Yönetici</Text>
          </Flex>
        </Box>

        <Box bg="bg.surface" p="6" borderRadius="xl" boxShadow="sm" gridColumn={{ md: "span 2" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap="6" align="stretch">

              <Box>
                <Text fontSize="lg" fontWeight="bold" mb="4" color="text.primary">Kişisel ve Fiziksel Bilgiler</Text>
                <VStack gap="4" align="stretch">
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Ad</Text>
                      <Input {...register("firstName")} size="sm" />
                      {errors.firstName && <Text color="red.500" fontSize="xs" mt="1">{errors.firstName.message}</Text>}
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Soyad</Text>
                      <Input {...register("lastName")} size="sm" />
                      {errors.lastName && <Text color="red.500" fontSize="xs" mt="1">{errors.lastName.message}</Text>}
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">E-posta Adresi</Text>
                      <Input {...register("email")} type="email" size="sm" />
                      {errors.email && <Text color="red.500" fontSize="xs" mt="1">{errors.email.message}</Text>}
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Telefon Numarası</Text>
                      <Input {...register("phone")} placeholder="+90 ..." size="sm" />
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, sm: 3 }} gap="4">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Yaş</Text>
                      <Input {...register("age")} type="number" size="sm" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Boy (cm)</Text>
                      <Input {...register("height")} type="number" size="sm" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="1">Kilo (kg)</Text>
                      <Input {...register("weight")} type="number" size="sm" />
                    </Box>
                  </SimpleGrid>
                </VStack>
              </Box>

              <Box pt="2" borderTopWidth="1px" borderColor="border.subtle">
                <Text fontSize="lg" fontWeight="bold" mb="4" color="text.primary">Adres Bilgileri</Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="1">Şehir</Text>
                    <Input {...register("city")} size="sm" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="1">Ülke</Text>
                    <Input {...register("country")} size="sm" />
                  </Box>
                </SimpleGrid>
              </Box>

              <Flex justify="flex-end" pt="2">
                <Button type="submit" colorPalette="blue" size="sm" loading={updateMutation.isPending}>
                  Değişiklikleri Kaydet
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>
    </Box>
  );
}