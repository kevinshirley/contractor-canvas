import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectForm } from "@/components/project/ProjectForm";
import { Edit, DollarSign, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ContractorHours = {
  contractorId: string;
  hours: number;
  billingType: 'hourly' | 'fixed';
  fixedAmount?: number;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [contractorHours, setContractorHours] = useState<ContractorHours[]>([]);
  const [project, setProject] = useState<any>(null);
  const [netValue, setNetValue] = useState<number>(0);
  const [currentProjectValue, setCurrentProjectValue] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const foundProject = projects.find((p: any) => p.id.toString() === id);
    
    if (foundProject) {
      setProject(foundProject);
      setSelectedContractors(foundProject.contractors || []);
      setContractorHours(foundProject.contractorHours || []);
      setCurrentProjectValue(parseFloat(foundProject.value) || 0);
      calculateNetValue(parseFloat(foundProject.value), foundProject.contractorHours || []);
    } else {
      toast.error("Project not found");
      navigate("/projects");
    }
  }, [id, navigate]);

  const calculateNetValue = (projectValue: number, hours: ContractorHours[]) => {
    const totalContractorCost = hours.reduce((acc, curr) => {
      if (curr.billingType === 'fixed') {
        return acc + (curr.fixedAmount || 0);
      }
      const contractor = contractors.find((c: any) => c.id.toString() === curr.contractorId);
      if (!contractor) return acc;
      
      const rate = parseFloat(contractor.rate.replace(/[^0-9.]/g, ''));
      return acc + (rate * curr.hours);
    }, 0);

    setNetValue(projectValue - totalContractorCost);
  };

  const handleProjectValueChange = (value: number) => {
    setCurrentProjectValue(value);
    calculateNetValue(value, contractorHours);
  };

  const onSubmit = (values: any) => {
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
      : [...contractorHours, { 
          contractorId, 
          hours, 
          billingType: 'hourly' as const,
          fixedAmount: 0
        }];
    
    setContractorHours(updatedHours);
    calculateNetValue(currentProjectValue, updatedHours);
  };

  const updateContractorBillingType = (contractorId: string, billingType: 'hourly' | 'fixed') => {
    const updatedHours = contractorHours.map(ch => 
      ch.contractorId === contractorId 
        ? { ...ch, billingType } 
        : ch
    );
    
    setContractorHours(updatedHours);
    calculateNetValue(currentProjectValue, updatedHours);
  };

  const updateContractorFixedAmount = (contractorId: string, amount: number) => {
    const updatedHours = contractorHours.map(ch => 
      ch.contractorId === contractorId 
        ? { ...ch, fixedAmount: amount } 
        : ch
    );
    
    setContractorHours(updatedHours);
    calculateNetValue(currentProjectValue, updatedHours);
  };

  const addContractor = (contractorId: string) => {
    if (!selectedContractors.includes(contractorId)) {
      setSelectedContractors([...selectedContractors, contractorId]);
      setContractorHours([...contractorHours, { 
        contractorId, 
        hours: 0, 
        billingType: 'hourly' as const,
        fixedAmount: 0
      }]);
      toast.success("Contractor added to project");
    }
  };

  const removeContractor = (contractorId: string) => {
    setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
    const updatedHours = contractorHours.filter(ch => ch.contractorId !== contractorId);
    setContractorHours(updatedHours);
    calculateNetValue(currentProjectValue, updatedHours);
    toast.success("Contractor removed from project");
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "N/A";
  };

  const renderDisplayView = () => {
    if (!project) return null;

    const client = clients.find((c: any) => c.id === project.clientId);
    const totalContractorCost = contractorHours.reduce((acc, curr) => {
      if (curr.billingType === 'fixed') {
        return acc + (curr.fixedAmount || 0);
      }
      const contractor = contractors.find((c: any) => c.id.toString() === curr.contractorId);
      if (!contractor) return acc;
      const rate = parseFloat(contractor.rate.replace(/[^0-9.]/g, ''));
      return acc + (rate * curr.hours);
    }, 0);

    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <Badge variant="outline" className="text-sm">
                {project.status}
              </Badge>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-muted-foreground">
                <User className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Client</p>
                  <p>{client ? `${client.firstName} ${client.lastName}` : 'N/A'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-4 text-muted-foreground">
                <DollarSign className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Project Value</p>
                  <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(project.value))}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-4 text-muted-foreground">
                <DollarSign className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Net Value</p>
                  <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(project.value) - totalContractorCost)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contractors</h3>
              <div className="grid gap-4">
                {selectedContractors.map((contractorId) => {
                  const contractor = contractors.find((c: any) => c.id.toString() === contractorId);
                  const hours = contractorHours.find(ch => ch.contractorId === contractorId);
                  if (!contractor || !hours) return null;
                  
                  const amount = hours.billingType === 'fixed' 
                    ? hours.fixedAmount 
                    : parseFloat(contractor.rate.replace(/[^0-9.]/g, '')) * hours.hours;

                  return (
                    <Card key={contractorId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{contractor.name}</p>
                            <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {hours.billingType === 'fixed' 
                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(hours.fixedAmount || 0)
                                : `${hours.hours} hours @ ${contractor.rate}`
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
            <BreadcrumbPage>{isEditing ? 'Edit Project' : 'Project Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Project' : 'Project Details'}</h1>
        </CardHeader>
        {isEditing ? (
          <ProjectForm
            project={project}
            clients={clients}
            onSubmit={onSubmit}
            selectedContractors={selectedContractors}
            netValue={netValue}
            contractors={contractors}
            contractorHours={contractorHours}
            onAddContractor={addContractor}
            onRemoveContractor={removeContractor}
            onUpdateHours={updateContractorHours}
            onValueChange={handleProjectValueChange}
            onUpdateBillingType={updateContractorBillingType}
            onUpdateFixedAmount={updateContractorFixedAmount}
          />
        ) : (
          renderDisplayView()
        )}
      </Card>
    </div>
  );
};

export default ProjectDetails;
