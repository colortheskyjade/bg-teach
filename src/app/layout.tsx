import type { Metadata } from "next";
import { Providers } from "./providers";
import { Box, Container, HStack } from "@chakra-ui/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Board Game Teacher",
  description: "Manage and learn your board games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box as="nav" p={4} borderBottomWidth="1px">
            <Container maxW="container.md">
              <HStack spacing={4}>
                <Link href="/" fontWeight="bold">Home</Link>
                <Link href="/boardgames" fontWeight="bold">Board Games</Link>
              </HStack>
            </Container>
          </Box>
          {children}
        </Providers>
      </body>
    </html>
  );
}
