import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ContractorsList } from "@/components/project/ContractorsList";
import { TaskNameField } from "./form/TaskNameField";
import { ClientField } from "@/components/project/form/ClientField";
import { TaskValueFields } from "./form/TaskValueFields";
import { TaskDescriptionField } from "./form/TaskDescriptionField";
import { formSchema, FormSchema } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TaskFormProps = {
  task: any;
  clients: any[];
  tasks?: any[];
  onSubmit: (values: FormSchema) => void;
  selectedContractors: string[];
  netValue: number;
  contractors: any[];
  contractorHours: Array<{ 
    contractorId: string; 
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>;
  onAddContractor: (contractorId: string) => void;
  onRemoveContractor: (contractorId: string) => void;
  onUpdateHours: (contractorId: string, hours: number) => void;
  onValueChange?: (value: number) => void;
  onUpdateBillingType: (contractorId: string, billingType: 'hourly' | 'fixed') => void;
  onUpdateFixedAmount: (contractorId: string, amount: number) => void;
};

export const TaskForm = ({
  task,
  clients,
  tasks = [],
  onSubmit,
  selectedContractors,
  netValue,
  contractors,
  contractorHours,
  onAddContractor,
  onRemoveContractor,
  onUpdateHours,
  onValueChange,
  onUpdateBillingType,
  onUpdateFixedAmount,
}: TaskFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: task ? {
      name: task.name,
      clientId: task.clientId,
      value: task.value.toString(),
      status: task.status,
      description: task.description || "",
      parentTaskId: task.parentTaskId,
    } : undefined,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <TaskNameField form={form} />
          <TaskDescriptionField form={form} />
          <ClientField form={form} clients={clients} />
          
          {tasks.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Make this a subtask of (Optional)</label>
              <Select
                value={form.watch("parentTaskId")}
                onValueChange={(value) => form.setValue("parentTaskId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select main task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks
                    .filter(t => t.id !== task?.id) // Prevent selecting self as parent
                    .map((t: any) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ContractorsList
            contractors={contractors}
            selectedContractors={selectedContractors}
            contractorHours={contractorHours}
            onAddContractor={onAddContractor}
            onRemoveContractor={onRemoveContractor}
            onUpdateHours={onUpdateHours}
            onUpdateBillingType={onUpdateBillingType}
            onUpdateFixedAmount={onUpdateFixedAmount}
          />
          <TaskValueFields 
            form={form} 
            netValue={netValue}
            onValueChange={onValueChange}
            isTask={true}
          />
        </CardContent>
        <CardFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/tasks")}
          >
            Cancel
          </Button>
          <Button type="submit">Update Task</Button>
        </CardFooter>
      </form>
    </Form>
  );
};