import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectForm } from "@/components/project/ProjectForm";
import { ProjectHeader } from "@/components/project/display/ProjectHeader";
import { ProjectDetailsView } from "@/components/project/display/ProjectDetails";
import { ProjectContractors } from "@/components/project/display/ProjectContractors";
import { Button } from "@/components/ui/button";

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

  const handleDeleteProject = () => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = projects.filter((p: any) => p.id.toString() !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Project deleted successfully");
    navigate("/projects");
  };

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
    setIsEditing(false);
    setProject(updatedProject);
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
      const newContractorHour = {
        contractorId,
        hours: 0,
        billingType: 'hourly' as const,
        fixedAmount: 0
      };
      setContractorHours([...contractorHours, newContractorHour]);
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

  const client = clients.find((c: any) => c.id === project?.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/tasks">Tasks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditing ? 'Edit Task' : 'Task Details'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {!isEditing && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
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
        ) : project ? (
          <>
            <ProjectHeader
              name={project.name}
              status={project.status}
              onEdit={() => setIsEditing(true)}
            />
            <ProjectDetailsView
              client={client}
              projectValue={parseFloat(project.value)}
              netValue={netValue}
              totalContractorCost={currentProjectValue - netValue}
            />
            <ProjectContractors
              selectedContractors={selectedContractors}
              contractors={contractors}
              contractorHours={contractorHours}
            />
          </>
        ) : null}
      </Card>
    </div>
  );
};

export default ProjectDetails;
