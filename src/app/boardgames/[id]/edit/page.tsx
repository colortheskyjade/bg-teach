"use client";

import React, { useEffect, useState, use } from 'react';
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
  useToast,
  Divider,
  IconButton,
  Textarea,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

interface BoardGame {
  id: string;
  name: string;
  slug: string;
  bggUrl: string;
}

interface Resource {
  id: string;
  type: string;
  content: string;
}

export default function EditBoardGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [game, setGame] = useState<BoardGame | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [name, setName] = useState('');
  const [bggUrl, setBggUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, resourcesRes] = await Promise.all([
          fetch(`/api/boardgames/${id}`),
          fetch(`/api/boardgames/${id}/resources`),
        ]);

        if (gameRes.ok) {
          const gameData = await gameRes.json();
          setGame(gameData);
          setName(gameData.name);
          setBggUrl(gameData.bggUrl);
        }

        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json();
          setResources(resourcesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/boardgames/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bggUrl }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // If the slug changed, we need to redirect to the new URL
        if (updatedData.slug && updatedData.slug !== id) {
          router.push(`/boardgames/${updatedData.slug}/edit`);
        }
        toast({
          title: 'Board game updated',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error('Failed to update board game');
      }
    } catch (error) {
      toast({
        title: 'Error updating board game',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`/api/boardgames/${id}/upload-rules`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newResource = await response.json();
        setResources((prev) => {
          const filtered = prev.filter((r) => r.type !== 'RULEBOOK');
          return [...filtered, newResource];
        });
        setSelectedFile(null);
        toast({
          title: 'Rulebook processed successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error('Failed to upload rulebook');
      }
    } catch (error) {
      toast({
        title: 'Error processing rulebook',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const rulebook = resources.find((r) => r.type === 'RULEBOOK');

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack spacing={4}>
          <IconButton
            aria-label="Back to list"
            icon={<ArrowBackIcon />}
            onClick={() => router.push('/boardgames')}
          />
          <Heading as="h1" size="xl">
            Edit {game?.name}
          </Heading>
        </HStack>

        <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>
            Game Details
          </Heading>
          <form onSubmit={handleUpdateGame}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter game name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>BGG URL</FormLabel>
                <Input
                  value={bggUrl}
                  onChange={(e) => setBggUrl(e.target.value)}
                  placeholder="https://boardgamegeek.com/boardgame/..."
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSaving}
              >
                Update Details
              </Button>
            </VStack>
          </form>
        </Box>

        <Divider />

        <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="md" mb={4}>
            Rulebook (PDF)
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Select Rulebook PDF</FormLabel>
              <HStack>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  p={1}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleFileUpload}
                  isLoading={isUploading}
                  isDisabled={!selectedFile}
                >
                  Upload
                </Button>
              </HStack>
            </FormControl>
            {isUploading && (
              <HStack>
                <Spinner size="sm" />
                <Text>Gemini is processing your rulebook...</Text>
              </HStack>
            )}
            {rulebook ? (
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>Extracted Rules:</Text>
                <Textarea
                  value={rulebook.content}
                  readOnly
                  minH="300px"
                  fontSize="sm"
                  bg="gray.50"
                />
              </Box>
            ) : !isUploading && (
              <Box mt={4} p={4} bg="orange.50" borderRadius="md" borderWidth="1px" borderColor="orange.200">
                <Text color="orange.800" fontWeight="medium">
                  No rulebook has been uploaded yet. Please upload a PDF to extract the rules.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
