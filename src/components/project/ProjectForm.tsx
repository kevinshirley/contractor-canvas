import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ContractorsList } from "./ContractorsList";
import { ProjectNameField } from "./form/ProjectNameField";
import { ClientField } from "./form/ClientField";
import { ProjectValueFields } from "./form/ProjectValueFields";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientId: z.string().min(1, "Client is required"),
  value: z.string().min(1, "Project value is required"),
  status: z.string(),
});

type ProjectFormProps = {
  project: any;
  clients: any[];
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  selectedContractors: string[];
  netValue: number;
  contractors: any[];
  contractorHours: Array<{ contractorId: string; hours: number }>;
  onAddContractor: (contractorId: string) => void;
  onRemoveContractor: (contractorId: string) => void;
  onUpdateHours: (contractorId: string, hours: number) => void;
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
}: ProjectFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: project ? {
      name: project.name,
      clientId: project.clientId,
      value: project.value.toString(),
      status: project.status,
    } : undefined,
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
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
          />
          <ProjectValueFields form={form} netValue={netValue} />
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