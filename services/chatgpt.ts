import type { FaceMetadata } from '@/types/scan';

export const analyzeFaceMetadata = async (
  metadata: FaceMetadata[]
): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You analyze face scan metadata.' },
          { role: 'user', content: `Analyze this metadata: ${JSON.stringify(metadata)}` },
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  } catch (error) {
    console.error('ChatGPT analysis failed', error);
    throw error;
  }
};
