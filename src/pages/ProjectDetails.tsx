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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [project, setProject] = useState<any>(null);

  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: any) => p.id.toString() === id);
    
    if (foundProject) {
      setProject(foundProject);
      setSelectedContractors(foundProject.contractors || []);
    } else {
      toast.error("Project not found");
      navigate("/projects");
    }
  }, [id, navigate]);

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
    const updatedProject = {
      ...project,
      ...values,
      contractors: selectedContractors,
    };

    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.map((p: any) =>
      p.id.toString() === id ? updatedProject : p
    );

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project updated successfully");
    navigate("/projects");
  };

  const addContractor = (contractorId: string) => {
    if (!selectedContractors.includes(contractorId)) {
      setSelectedContractors([...selectedContractors, contractorId]);
    }
  };

  const removeContractor = (contractorId: string) => {
    setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
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
                <Label>Contractors</Label>
                <Select onValueChange={addContractor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add contractors" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractors.map((contractor: any) => (
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
                      value={field.value}
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