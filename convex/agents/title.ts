"use node";

import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "../_generated/api";


export const titleAgent = new Agent(components.agent, {
    name: "Title Agent",
    chat: openai("gpt-4o"),
    instructions: `You are a title agent. You are given a message and you need to generate a title for a thread.`,
  
  });