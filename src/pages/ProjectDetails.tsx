import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientId: z.string().min(1, "Client is required"),
  value: z.string().min(1, "Project value is required"),
  status: z.string(),
});

type ContractorHours = {
  contractorId: string;
  hours: number;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [contractorHours, setContractorHours] = useState<ContractorHours[]>([]);
  const [project, setProject] = useState<any>(null);
  const [netValue, setNetValue] = useState<number>(0);

  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: any) => p.id.toString() === id);
    
    if (foundProject) {
      setProject(foundProject);
      setSelectedContractors(foundProject.contractors || []);
      setContractorHours(foundProject.contractorHours || []);
      calculateNetValue(foundProject.value, foundProject.contractorHours || []);
    } else {
      toast.error("Project not found");
      navigate("/projects");
    }
  }, [id, navigate]);

  const calculateNetValue = (projectValue: number, hours: ContractorHours[]) => {
    const totalContractorCost = hours.reduce((acc, curr) => {
      const contractor = contractors.find((c: any) => c.id.toString() === curr.contractorId);
      if (!contractor) return acc;
      
      const rate = parseFloat(contractor.rate.replace(/[^0-9.]/g, ''));
      return acc + (rate * curr.hours);
    }, 0);

    setNetValue(projectValue - totalContractorCost);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: project ? {
      name: project.name,
      clientId: project.clientId,
      value: project.value.toString(),
      status: project.status,
    } : undefined,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedContractors.length === 0) {
      toast.error("Please add at least one contractor to the project");
      return;
    }

    const projectValue = parseFloat(values.value);
    const updatedProject = {
      ...project,
      ...values,
      value: projectValue,
      contractors: selectedContractors,
      contractorHours: contractorHours,
      netValue: netValue,
    };

    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: any) =>
      p.id.toString() === id ? updatedProject : p
    );

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project updated successfully");
    navigate("/projects");
  };

  const updateContractorHours = (contractorId: string, hours: number) => {
    const updatedHours = contractorHours.some(ch => ch.contractorId === contractorId)
      ? contractorHours.map(ch => 
          ch.contractorId === contractorId 
            ? { ...ch, hours } 
            : ch
        )
      : [...contractorHours, { contractorId, hours }];
    
    setContractorHours(updatedHours);
    calculateNetValue(parseFloat(form.getValues("value")), updatedHours);
  };

  const addContractor = (contractorId: string) => {
    if (!selectedContractors.includes(contractorId)) {
      setSelectedContractors([...selectedContractors, contractorId]);
      toast.success("Contractor added to project");
    }
  };

  const removeContractor = (contractorId: string) => {
    setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
    setContractorHours(contractorHours.filter(ch => ch.contractorId !== contractorId));
    toast.success("Contractor removed from project");
  };

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Project</h1>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.firstName} {client.lastName} - {client.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Contractors and Hours</Label>
                <Select onValueChange={addContractor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add contractors" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractors
                      .filter((contractor: any) => !selectedContractors.includes(contractor.id.toString()))
                      .map((contractor: any) => (
                        <SelectItem
                          key={contractor.id}
                          value={contractor.id.toString()}
                        >
                          {contractor.name} - {contractor.specialty}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 space-y-2">
                  {selectedContractors.map((contractorId) => {
                    const contractor = contractors.find(
                      (c: any) => c.id.toString() === contractorId
                    );
                    const contractorHour = contractorHours.find(
                      ch => ch.contractorId === contractorId
                    );
                    return contractor ? (
                      <div
                        key={contractorId}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <div className="flex-1">
                          <span className="block">
                            {contractor.name} - {contractor.specialty}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Hours"
                              className="w-24"
                              value={contractorHour?.hours || ""}
                              onChange={(e) => updateContractorHours(contractorId, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-sm text-muted-foreground">
                              hours @ {contractor.rate}/hr
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContractor(contractorId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Value ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          calculateNetValue(parseFloat(e.target.value) || 0, contractorHours);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Net Project Value</Label>
                <Input
                  value={new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(netValue)}
                  readOnly
                  disabled
                />
              </div>

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
      </Card>
    </div>
  );
};

export default ProjectDetails;
