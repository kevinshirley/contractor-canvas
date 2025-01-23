import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ContractorsList } from "./ContractorsList";
import { ProjectNameField } from "./form/ProjectNameField";
import { ClientField } from "./form/ClientField";
import { ProjectValueFields } from "./form/ProjectValueFields";
import { formSchema, FormSchema } from "./types";

type ProjectFormProps = {
  project: any;
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

export const ProjectForm = ({
  project,
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
}: ProjectFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: project ? {
      name: project.name,
      clientId: project.clientId,
      value: project.value.toString(),
      status: project.status,
    } : undefined,
  });

  const handleSubmit = (values: FormSchema) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          <ProjectNameField form={form} />
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
          <ProjectValueFields 
            form={form} 
            netValue={netValue}
            onValueChange={onValueChange}
          />
        </CardContent>
        <CardFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/projects")}
          >
            Cancel
          </Button>
          <Button type="submit">Update Project</Button>
        </CardFooter>
      </form>
    </Form>
  );
};