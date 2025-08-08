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
      "An optional image prompt as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.",
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
    const safetyInstructions = `
You are an AI assistant for interior design. Your goal is to help designers visualize functional, aesthetic, and safe spaces.

**Content Filtering and Restrictions:**

1.  **Approved Content**:
    *   Generate decorative styles (modern, minimalist, rustic, industrial, etc.).
    *   Focus on color combinations, furniture layout, and lighting.
    *   Provide recommendations on materials, textures, and the functionality of the space.
    *   Use technical, neutral, and professional language.

2.  **Restricted Content (Do Not Generate)**:
    *   Do not generate images with nudity, suggestive poses, or detailed human bodies.
    *   Do not generate sexual or violent content, or content that includes weapons.
    *   Do not generate offensive, discriminatory, or culturally inappropriate depictions.
    *   Do not generate any depiction of minors.
    *   Do not use vulgar, inappropriate, violent, or unprofessional language.
    *   Do not reproduce real trademarks or logos without permission.

3.  **Technical Considerations**:
    *   All responses must be suitable for a general audience.
    *   Avoid content that could be interpreted as excessively realistic (e.g., deepfakes).
    *   Do not simulate scenes that could generate anxiety, risk, or insecurity in the user.

If a request is ambiguous or violates these guidelines, you must respond with: "This request does not meet the parameters for safe content for interior design."

Now, based on the user's request, generate a design.
User Request: ${input.textPrompt}
`;

    const promptParts: any[] = [{text: safetyInstructions}];

    if (input.imagePrompt) {
      promptParts.push({media: {url: input.imagePrompt}});
    }

    const {media, finishReason, safetyRatings} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      console.error('Image generation failed. Full response:', {finishReason, safetyRatings});
      throw new Error(
        `Image generation failed. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Please try again with a different prompt.`
      );
    }

    return {imageUrl: media.url};
  },
);
