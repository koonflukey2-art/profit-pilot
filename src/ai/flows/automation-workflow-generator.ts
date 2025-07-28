'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating n8n workflow configurations based on user settings.
 *
 * The flow takes user-defined settings and goals related to ad campaign automation
 * and generates a basic n8n workflow JSON configuration.
 *
 * @interface AutomationWorkflowGeneratorInput - Defines the input schema for the flow.
 * @interface AutomationWorkflowGeneratorOutput - Defines the output schema for the flow.
 * @function automationWorkflowGenerator - The main function to trigger the workflow generation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomationWorkflowGeneratorInputSchema = z.object({
  workflowName: z.string().describe('The name of the n8n workflow.'),
  primaryGoal: z.string().describe('The primary goal of the workflow (e.g., scale revenue, reduce CPA).'),
  platforms: z.array(z.string()).describe('An array of platform names to integrate (e.g., facebook, google).'),
  features: z.array(z.string()).describe('An array of feature names to include in the workflow (e.g., budget optimization, creative refresh).'),
  rules: z.array(z.any()).describe('Array of automation rules.'),
});

export type AutomationWorkflowGeneratorInput = z.infer<typeof AutomationWorkflowGeneratorInputSchema>;

const AutomationWorkflowGeneratorOutputSchema = z.object({
  workflowJson: z.string().describe('The generated n8n workflow JSON configuration.'),
});

export type AutomationWorkflowGeneratorOutput = z.infer<typeof AutomationWorkflowGeneratorOutputSchema>;

export async function automationWorkflowGenerator(input: AutomationWorkflowGeneratorInput): Promise<AutomationWorkflowGeneratorOutput> {
  return automationWorkflowGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automationWorkflowGeneratorPrompt',
  input: {schema: AutomationWorkflowGeneratorInputSchema},
  output: {schema: AutomationWorkflowGeneratorOutputSchema},
  prompt: `You are an AI workflow generator that outputs a JSON configuration for the n8n automation platform. You take high-level objectives and output functional code.

  Given the following specifications, generate a JSON configuration for an n8n workflow:

  Workflow Name: {{{workflowName}}}
  Primary Goal: {{{primaryGoal}}}
  Platforms: {{#each platforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Features: {{#each features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Rules: {{#each rules}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Ensure the output is a valid JSON configuration that can be directly imported into n8n.  The JSON MUST be complete and valid.
  `, // Changed from Handlebars to regular template literals
});

const automationWorkflowGeneratorFlow = ai.defineFlow(
  {
    name: 'automationWorkflowGeneratorFlow',
    inputSchema: AutomationWorkflowGeneratorInputSchema,
    outputSchema: AutomationWorkflowGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {workflowJson: output!.workflowJson!};
  }
);
