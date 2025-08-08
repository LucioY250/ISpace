'use server';
/**
 * @fileOverview This file defines a Genkit flow for iterating on an interior design based on user feedback.
 *
 * - iterateDesignBasedOnFeedback - A function that takes user feedback and a design image data URI to refine the design.
 * - IterateDesignBasedOnFeedbackInput - The input type for the iterateDesignBasedOnFeedback function.
 * - IterateDesignBasedOnFeedbackOutput - The output type for the iterateDesignBasedOnFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IterateDesignBasedOnFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .describe("User feedback on the design, e.g., 'love it', 'not quite', or specific suggestions."),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the current design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IterateDesignBasedOnFeedbackInput = z.infer<typeof IterateDesignBasedOnFeedbackInputSchema>;

const IterateDesignBasedOnFeedbackOutputSchema = z.object({
  refinedDesignDataUri: z
    .string()
    .describe(
      'A data URI containing the refined interior design image, based on the user feedback provided. It must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type IterateDesignBasedOnFeedbackOutput = z.infer<typeof IterateDesignBasedOnFeedbackOutputSchema>;

export async function iterateDesignBasedOnFeedback(
  input: IterateDesignBasedOnFeedbackInput
): Promise<IterateDesignBasedOnFeedbackOutput> {
  return iterateDesignBasedOnFeedbackFlow(input);
}

const iterateDesignBasedOnFeedbackFlow = ai.defineFlow(
  {
    name: 'iterateDesignBasedOnFeedbackFlow',
    inputSchema: IterateDesignBasedOnFeedbackInputSchema,
    outputSchema: IterateDesignBasedOnFeedbackOutputSchema,
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

Now, based on the user's feedback, refine the provided design.
User Feedback: ${input.feedback}
`;
    const {media, finishReason, safetyRatings} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: safetyInstructions},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      console.error('Image iteration failed. Full response:', {finishReason, safetyRatings});
      throw new Error(
        `Image iteration failed. Finish reason: ${finishReason}. Safety ratings: ${JSON.stringify(safetyRatings)}. Please try again with a different prompt.`
      );
    }

    return {refinedDesignDataUri: media.url};
  }
);
