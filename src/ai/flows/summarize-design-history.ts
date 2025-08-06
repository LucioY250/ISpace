// Summarizes the design changes made throughout the version history of a design.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDesignHistoryInputSchema = z.object({
  designHistory: z
    .array(z.string())
    .describe('An array of design descriptions representing the history of design versions.'),
});
export type SummarizeDesignHistoryInput = z.infer<typeof SummarizeDesignHistoryInputSchema>;

const SummarizeDesignHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the design changes throughout the version history.'),
});
export type SummarizeDesignHistoryOutput = z.infer<typeof SummarizeDesignHistoryOutputSchema>;

export async function summarizeDesignHistory(
  input: SummarizeDesignHistoryInput
): Promise<SummarizeDesignHistoryOutput> {
  return summarizeDesignHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDesignHistoryPrompt',
  input: {schema: SummarizeDesignHistoryInputSchema},
  output: {schema: SummarizeDesignHistoryOutputSchema},
  prompt: `You are an AI assistant helping users understand the evolution of their interior designs.

  Summarize the following design history in a concise and informative way, highlighting the key changes and improvements made over time:

  Design History:
  {{#each designHistory}}
  - {{{this}}}
  {{/each}}
  `,
});

const summarizeDesignHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeDesignHistoryFlow',
    inputSchema: SummarizeDesignHistoryInputSchema,
    outputSchema: SummarizeDesignHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
