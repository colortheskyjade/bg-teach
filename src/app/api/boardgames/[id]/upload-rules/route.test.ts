import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import ResourceModel from '@/models/Resource';
import { generateText } from 'ai';
import connectDB from '@/lib/db/mongodb';

// Mock dependencies
vi.mock('@/lib/db/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/models/Resource', () => ({
  __esModule: true,
  default: {
    findOneAndUpdate: vi.fn(),
  },
  ResourceType: {
    RULEBOOK: 'RULEBOOK',
  },
}));

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(),
}));

describe('POST /api/boardgames/[id]/upload-rules', () => {
  const boardGameId = 'test-game-id';
  const params = Promise.resolve({ id: boardGameId });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if no file is uploaded', async () => {
    const request = new Request('http://localhost/api/boardgames/123/upload-rules', {
      method: 'POST',
      body: new FormData(),
    });

    const response = await POST(request, { params: { id: '123' } } as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No file uploaded');
  });

  it('should process PDF and save resource successfully', async () => {
    const mockText = 'Extracted rules content';
    (generateText as any).mockResolvedValue({ text: mockText });

    const mockResource = {
      _id: 'resource-id',
      type: 'RULEBOOK',
      content: mockText,
    };
    (ResourceModel.findOneAndUpdate as any).mockResolvedValue(mockResource);

    const formData = new FormData();
    const file = new File(['pdf content'], 'rules.pdf', { type: 'application/pdf' });
    formData.append('file', file);

    const request = new Request(`http://localhost/api/boardgames/${boardGameId}/upload-rules`, {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request, { params: { id: boardGameId } } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 'resource-id',
      type: 'RULEBOOK',
      content: mockText,
    });

    expect(connectDB).toHaveBeenCalled();
    expect(generateText).toHaveBeenCalled();
    expect(ResourceModel.findOneAndUpdate).toHaveBeenCalledWith(
      { boardGameId, type: 'RULEBOOK' },
      { $set: { boardGameId, type: 'RULEBOOK', content: mockText } },
      { upsert: true, new: true }
    );
  });

  it('should return 500 if an error occurs', async () => {
    const errorMessage = 'AI processing failed';
    (generateText as any).mockRejectedValue(new Error(errorMessage));

    const formData = new FormData();
    const file = new File(['pdf content'], 'rules.pdf', { type: 'application/pdf' });
    formData.append('file', file);

    const request = new Request(`http://localhost/api/boardgames/${boardGameId}/upload-rules`, {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request, { params: { id: boardGameId } } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe(errorMessage);
  });
});
