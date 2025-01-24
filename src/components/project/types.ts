import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientId: z.string().min(1, "Client is required"),
  value: z.string().min(1, "Project value is required"),
  status: z.string(),
  description: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;