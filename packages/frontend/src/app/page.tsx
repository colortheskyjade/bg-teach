import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        w="full"
        maxW="md"
        bg="white"
        _dark={{ bg: "gray.800" }}
      >
        <VStack spacing={4} align="stretch">
          <Box h="300px" overflowY="auto" borderBottomWidth="1px" pb={4}>
            {/* Chat messages will go here */}
            <Text>No messages yet.</Text>
          </Box>
          <HStack>
            <Input placeholder="Type your message..." />
            <Button colorScheme="blue">Send</Button>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}
