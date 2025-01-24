import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  clientId: z.string().min(1, "Client is required"),
  value: z.string().min(1, "Task value is required"),
  status: z.string(),
  description: z.string().optional(),
  subTasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    completed: boolean(),
    description: z.string().optional(),
    contractorId: z.string().optional(),
  })).optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export type SubTask = {
  id: string;
  name: string;
  completed: boolean;
  description?: string;
  contractorId?: string;
};