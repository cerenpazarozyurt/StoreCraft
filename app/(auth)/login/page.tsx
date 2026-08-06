"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Heading, Input, InputGroup, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"; //form elemanlarının düzenli durması için(form elemanları, label, hata mesajları birlikte sarmalayan yapı.)
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { User, Lock } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";
import { login } from "@/lib/auth";
import Cookies from "js-cookie"; //document.cookie ile de yapılırdı fakat js-cookie ile tek satırda çerez yönetimi yapılmasını sağlar.

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      Cookies.set("accessToken", result.accessToken, { expires: 1 });

      toaster.create({
        title: "Başarılı!",
        description: "Giriş yapıldı, yönlendiriliyorsunuz...",
        type: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      toaster.create({
        title: "Hata!",
        description: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.canvas" px={4}>
      <Box maxW="md" w="full" bg="bg.surface" p={8} borderRadius="xl" boxShadow="lg" border="1px" borderColor="border.default">
        <VStack gap={6} align="stretch">
          <VStack gap={2} align="center">
            <Heading size="md" color="accent.600" fontWeight="bold" letterSpacing="tight">
              StoreCraft
            </Heading>
            <Heading size="lg" fontWeight="bold" color="text.primary">
              Welcome back!
            </Heading>
            <Text fontSize="sm" color="text.muted">
              Login to your StoreCraft account
            </Text>
          </VStack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
              <Field label="Username" invalid={!!errors.username} errorText={errors.username?.message}>
                <InputGroup startElement={<User size={16} />} w="full">
                  <Input placeholder="emilys" {...register("username")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
                <InputGroup startElement={<Lock size={16} />} w="full">
                  <PasswordInput placeholder="********" {...register("password")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Button type="submit" colorPalette="accent" size="lg" w="full" loading={isLoading} borderRadius="md">
                Login
              </Button>
            </VStack>
          </form>

          <Flex justify="center" align="center" pt={2}>
            <Text fontSize="sm" color="text.muted">
              Don&apos;t have an account?{" "}
              <ChakraLink as={NextLink} href="/register" color="accent.500" fontWeight="semibold">
                Sign Up
              </ChakraLink>
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}