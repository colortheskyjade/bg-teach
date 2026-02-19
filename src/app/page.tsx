"use client";

import { useChat } from "@ai-sdk/react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Container,
  Heading,
} from "@chakra-ui/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <Flex
      minH="calc(100vh - 65px)"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      p={4}
    >
      <Container maxW="md">
        <VStack spacing={6}>
          <Heading size="lg">Board Game Teacher</Heading>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            w="full"
            bg="white"
            _dark={{ bg: "gray.800" }}
            shadow="md"
          >
            <VStack spacing={4} align="stretch">
              <Box h="400px" overflowY="auto" borderBottomWidth="1px" pb={4} px={2}>
                {messages.length === 0 ? (
                  <Text color="gray.500" textAlign="center" mt={4}>
                    Ask me anything about board games!
                  </Text>
                ) : (
                  messages.map((m) => (
                    <Box key={m.id} mb={4} textAlign={m.role === "user" ? "right" : "left"}>
                      <Text
                        display="inline-block"
                        bg={m.role === "user" ? "blue.500" : "gray.100"}
                        color={m.role === "user" ? "white" : "black"}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        fontSize="sm"
                        maxW="90%"
                      >
                        {m.content}
                      </Text>
                    </Box>
                  ))
                )}
              </Box>
              <form onSubmit={handleSubmit}>
                <HStack>
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Send
                  </Button>
                </HStack>
              </form>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
