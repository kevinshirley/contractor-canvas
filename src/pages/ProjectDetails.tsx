import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectForm } from "@/components/project/ProjectForm";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [contractorHours, setContractorHours] = useState<Array<{
    contractorId: string;
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>>([]);
  const [project, setProject] = useState<any>(null);
  const [netValue, setNetValue] = useState<number>(0);
  const [currentProjectValue, setCurrentProjectValue] = useState<number>(0);

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

  const calculateNetValue = (projectValue: number, hours: Array<{ 
    contractorId: string; 
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>) => {
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
          billingType: 'hourly',
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
        billingType: 'hourly',
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
      </Card>
    </div>
  );
};

export default ProjectDetails;