"use server";

import { generateUiTitles as genTitles, type UiTitlesInput } from '@/ai/flows/ai-copywriter-flow';
import { automationWorkflowGenerator as genWorkflow, type AutomationWorkflowGeneratorInput } from '@/ai/flows/automation-workflow-generator';
import { getMetricsAdvice as getAdvice, type MetricsAdviceInput } from '@/ai/flows/metrics-advisor';

export async function generateUiTitles(input: UiTitlesInput) {
    try {
        return await genTitles(input);
    } catch (error) {
        console.error("Error generating UI titles:", error);
        return {
            productInfoTitle: 'ข้อมูลสินค้า',
            costCalculationTitle: 'คำนวณต้นทุน',
            goalsAndResultsTitle: 'เป้าหมายและผลลัพธ์',
            advancedPlanningTitle: 'Advanced Planning',
        };
    }
}

export async function generateAutomationWorkflow(input: AutomationWorkflowGeneratorInput) {
    try {
        const result = await genWorkflow(input);
        // Ensure the output is a stringified JSON
        if (typeof result.workflowJson === 'object') {
             return { workflowJson: JSON.stringify(result.workflowJson, null, 2) };
        }
        return result;
    } catch (error) {
        console.error("Error generating workflow:", error);
        throw new Error("Failed to generate automation workflow.");
    }
}


export async function getMetricsAdvice(input: MetricsAdviceInput) {
    try {
        return await getAdvice(input);
    } catch (error) {
        console.error("Error getting metrics advice:", error);
        throw new Error("Failed to get AI-powered advice.");
    }
}
