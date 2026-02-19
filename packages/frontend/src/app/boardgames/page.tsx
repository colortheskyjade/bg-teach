"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  Link,
  List,
  ListItem,
  IconButton,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';

interface BoardGame {
  id: string;
  name: string;
  bggUrl: string;
}

const BoardGamesPage = () => {
  const [boardGames, setBoardGames] = useState<BoardGame[]>([]);
  const [newName, setNewName] = useState('');
  const [newBggUrl, setNewBggUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchBoardGames = async () => {
    try {
      const response = await fetch('/api/boardgames');
      const data = await response.json();
      setBoardGames(data);
    } catch (error) {
      console.error('Error fetching board games:', error);
      toast({
        title: 'Error fetching board games',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBoardGames();
  }, []);

  const handleAddBoardGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/boardgames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, bggUrl: newBggUrl }),
      });
      if (response.ok) {
        setNewName('');
        setNewBggUrl('');
        fetchBoardGames();
        toast({
          title: 'Board game added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to add board game');
      }
    } catch (error) {
      console.error('Error adding board game:', error);
      toast({
        title: 'Error adding board game',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBoardGame = async (id: string) => {
    try {
      const response = await fetch(`/api/boardgames/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchBoardGames();
        toast({
          title: 'Board game deleted',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to delete board game');
      }
    } catch (error) {
      console.error('Error deleting board game:', error);
      toast({
        title: 'Error deleting board game',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Board Game Management
        </Heading>

        <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>
            Add New Board Game
          </Heading>
          <form onSubmit={handleAddBoardGame}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel htmlFor="newName">Name</FormLabel>
                <Input
                  id="newName"
                  placeholder="Enter game name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="newBggUrl">BGG URL</FormLabel>
                <Input
                  id="newBggUrl"
                  type="url"
                  placeholder="https://boardgamegeek.com/boardgame/..."
                  value={newBggUrl}
                  onChange={(e) => setNewBggUrl(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Add Board Game
              </Button>
            </VStack>
          </form>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="md" mb={4}>
            Existing Board Games
          </Heading>
          {boardGames.length === 0 ? (
            <Text color="gray.500">No board games found.</Text>
          ) : (
            <List spacing={3}>
              {boardGames.map((game) => (
                <ListItem
                  key={game.id}
                  p={3}
                  shadow="sm"
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <HStack justifyContent="space-between">
                    <Box>
                      <Text fontWeight="bold">{game.name}</Text>
                      <Link href={game.bggUrl} isExternal color="blue.500" fontSize="sm">
                        BGG Link <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Box>
                    <IconButton
                      aria-label="Delete board game"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteBoardGame(game.id)}
                    />
                  </HStack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default BoardGamesPage;
