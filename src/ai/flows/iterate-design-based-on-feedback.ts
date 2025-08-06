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

const prompt = ai.definePrompt({
  name: 'iterateDesignBasedOnFeedbackPrompt',
  input: {schema: IterateDesignBasedOnFeedbackInputSchema},
  output: {schema: IterateDesignBasedOnFeedbackOutputSchema},
  prompt: `You are an AI interior design assistant. You will refine the given interior design image based on the user feedback.

Current Design:
{{media url=photoDataUri}}

User Feedback: {{{feedback}}}

Based on the user feedback, generate a refined version of the interior design. Ensure the refined design addresses the feedback provided.

Return the new image as a data URI.
`,
});

const iterateDesignBasedOnFeedbackFlow = ai.defineFlow(
  {
    name: 'iterateDesignBasedOnFeedbackFlow',
    inputSchema: IterateDesignBasedOnFeedbackInputSchema,
    outputSchema: IterateDesignBasedOnFeedbackOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Refine this design based on the following feedback: ${input.feedback}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No refined design was generated.');
    }

    return {refinedDesignDataUri: media.url};
  }
);
