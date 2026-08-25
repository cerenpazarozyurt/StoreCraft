"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Heading, Input, InputGroup, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { User, Mail, Lock, KeyRound } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false); //tanStackQuery ile de yapabilirsin. 
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Şifreler eşleşmiyor" });
      return; 
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toaster.create({
        title: "Hesap Oluşturuldu!",
        description: "Başarıyla kayıt oldunuz, giriş sayfasına yönlendiriliyorsunuz...",
        type: "success",
      });
      router.push("/login");
    }, 1000);
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
              Get Started with StoreCraft
            </Heading>
            <Text fontSize="sm" color="text.muted">
              Create your free account
            </Text>
          </VStack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
              <Field label="Full Name" invalid={!!errors.fullName} errorText={errors.fullName?.message}>
                <InputGroup startElement={<User size={16} />} w="full">
                  <Input type="text" placeholder="John Doe" {...register("fullName")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Field label="Email Address" invalid={!!errors.email} errorText={errors.email?.message}>
                <InputGroup startElement={<Mail size={16} />} w="full">
                  <Input type="email" placeholder="name@example.com" {...register("email")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Field label="Create a Strong Password" invalid={!!errors.password} errorText={errors.password?.message}>
                <InputGroup startElement={<Lock size={16} />} w="full">
                  <PasswordInput placeholder="********" {...register("password")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Field label="Confirm Password" invalid={!!errors.confirmPassword} errorText={errors.confirmPassword?.message}>
                <InputGroup startElement={<KeyRound size={16} />} w="full">
                  <PasswordInput placeholder="********" {...register("confirmPassword")} borderRadius="md" />
                </InputGroup>
              </Field>

              <Button type="submit" colorPalette="accent" size="lg" w="full" loading={isLoading} borderRadius="md" mt={2}>
                Sign Up
              </Button>
            </VStack>
          </form>

          <Flex justify="center" align="center" pt={2}>
            <Text fontSize="sm" color="text.muted">
              Already have an account?{" "}
              <ChakraLink as={NextLink} href="/login" color="accent.500" fontWeight="semibold">
                Login
              </ChakraLink>
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}