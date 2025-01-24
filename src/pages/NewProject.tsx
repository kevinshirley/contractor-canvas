import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
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
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  clientId: z.string().min(1, "Client is required"),
  value: z.string().min(1, "Project value is required"),
  status: z.string(),
});

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [contractorHours, setContractorHours] = useState<Array<{
    contractorId: string;
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>>([]);

  // Get clients and contractors from localStorage
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      clientId: "",
      value: "",
      status: "Planning",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedContractors.length === 0) {
      toast({
        title: "Warning",
        description: "Please add at least one contractor to the project",
        variant: "destructive",
      });
      return;
    }

    const newProject = {
      id: Date.now(),
      ...values,
      contractors: selectedContractors,
      contractorHours: contractorHours, // Add contractorHours to the project data
    };

    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    localStorage.setItem(
      "projects",
      JSON.stringify([...existingProjects, newProject])
    );

    toast({
      title: "Success",
      description: "Project created successfully",
    });

    navigate("/projects");
  };

  const addContractor = (contractorId: string) => {
    if (!selectedContractors.includes(contractorId)) {
      setSelectedContractors([...selectedContractors, contractorId]);
      // Initialize contractor hours when adding a contractor
      setContractorHours([
        ...contractorHours,
        {
          contractorId,
          hours: 0,
          billingType: 'hourly',
          fixedAmount: 0
        }
      ]);
      toast({
        title: "Success",
        description: "Contractor added to project",
      });
    }
  };

  const removeContractor = (contractorId: string) => {
    setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
    // Remove contractor hours when removing a contractor
    setContractorHours(contractorHours.filter(ch => ch.contractorId !== contractorId));
    toast({
      title: "Success",
      description: "Contractor removed from project",
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/projects">Projects</BreadcrumbLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                      defaultValue={field.value}
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
                <Label>Contractors</Label>
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
                    return (
                      <div
                        key={contractorId}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <span>
                          {contractor?.name} - {contractor?.specialty}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContractor(contractorId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
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
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Create Project</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewProject;
