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

type TaskFormProps = {
  task: any;
  clients: any[];
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
    } : undefined,
  });

  const handleSubmit = (values: FormSchema) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          <TaskNameField form={form} />
          <TaskDescriptionField form={form} />
          <ClientField form={form} clients={clients} />
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