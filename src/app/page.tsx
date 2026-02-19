"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
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
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface BoardGame {
  id: string;
  name: string;
}

export default function Home() {
  const [boardGames, setBoardGames] = useState<BoardGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/boardgames");
        if (res.ok) {
          const data = await res.json();
          setBoardGames(data);
        }
      } catch (error) {
        console.error("Error fetching board games:", error);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ 
      text: input,
      ...(selectedGameId ? {
        body: {
          data: {
            boardGameId: selectedGameId,
          },
        },
      } : {}),
    } as any);
    setInput("");
  };

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
          
          <Box w="full" bg="white" _dark={{ bg: "gray.800" }} p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
            <FormControl>
              <FormLabel fontSize="sm">Select a game to discuss rules:</FormLabel>
              <Select 
                placeholder="General Chat" 
                value={selectedGameId} 
                onChange={(e) => setSelectedGameId(e.target.value)}
              >
                {boardGames.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>

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
                {error && (
                  <Box p={2} mb={4} bg="red.50" color="red.500" borderRadius="md" fontSize="xs">
                    Error: {error.message}
                  </Box>
                )}
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
                        {m.parts.map((part, i) => 
                          part.type === 'text' ? <span key={i}>{part.text}</span> : null
                        )}
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
                    onChange={(e) => setInput(e.target.value)}
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
