'use server';

/**
 * @fileOverview A flow for generating interior design images based on user prompts.
 *
 * - generateInteriorDesign - A function that generates interior design images.
 * - GenerateInteriorDesignInput - The input type for the generateInteriorDesign function.
 * - GenerateInteriorDesignOutput - The return type for the generateInteriorDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInteriorDesignInputSchema = z.object({
  textPrompt: z.string().describe('A text prompt describing the desired interior design.'),
  imagePrompt: z
    .string()
    .optional()
    .describe(
      "An optional image prompt as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateInteriorDesignInput = z.infer<typeof GenerateInteriorDesignInputSchema>;

const GenerateInteriorDesignOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated interior design image.'),
});
export type GenerateInteriorDesignOutput = z.infer<typeof GenerateInteriorDesignOutputSchema>;

export async function generateInteriorDesign(
  input: GenerateInteriorDesignInput
): Promise<GenerateInteriorDesignOutput> {
  return generateInteriorDesignFlow(input);
}

const generateInteriorDesignFlow = ai.defineFlow(
  {
    name: 'generateInteriorDesignFlow',
    inputSchema: GenerateInteriorDesignInputSchema,
    outputSchema: GenerateInteriorDesignOutputSchema,
  },
  async input => {
    const promptParts: any[] = [{text: input.textPrompt}];

    if (input.imagePrompt) {
      promptParts.push({media: {url: input.imagePrompt}});
    }

    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media || !media.url) {
      throw new Error('No image was generated.');
    }

    return {imageUrl: media.url};
  }
);
