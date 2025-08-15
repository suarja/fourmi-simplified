import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("solo"), v.literal("couple")),
    created: v.number(),
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    profileId: v.id("profiles"),
    title: v.string(),
    created: v.number(),
    lastMessage: v.number(),
  }).index("by_profile", ["profileId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    type: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_conversation", ["conversationId"]),

  incomes: defineTable({
    profileId: v.id("profiles"),
    label: v.string(),
    amount: v.number(), // cents for precision
    isMonthly: v.boolean(), // false = annual
  }).index("by_profile", ["profileId"]),

  expenses: defineTable({
    profileId: v.id("profiles"),
    category: v.string(), // "Housing", "Food", "Transport"
    label: v.string(),
    amount: v.number(), // monthly amount in cents
  }).index("by_profile", ["profileId"]),

  loans: defineTable({
    profileId: v.id("profiles"),
    type: v.union(
      v.literal("credit_card"),
      v.literal("personal"),
      v.literal("mortgage"),
      v.literal("auto")
    ),
    name: v.string(),
    monthlyPayment: v.number(), // cents
    interestRate: v.number(), // 0.035 = 3.5%
    remainingBalance: v.number(), // cents
    remainingMonths: v.number(),
  }).index("by_profile", ["profileId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
