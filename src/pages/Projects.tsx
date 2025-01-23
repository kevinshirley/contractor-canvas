import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

type ContractorHours = {
  contractorId: string;
  hours: number;
}

type Project = {
  id: number;
  name: string;
  clientId: string;
  value: number;
  status: string;
  contractors: string[];
  contractorHours?: ContractorHours[];
  netValue?: number;
};

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    clientId: "1",
    value: 15000,
    status: "In Progress",
    contractors: [],
    contractorHours: [],
    netValue: 15000,
  },
  {
    id: 2,
    name: "Mobile App Development",
    clientId: "2",
    value: 25000,
    status: "Planning",
    contractors: [],
    contractorHours: [],
    netValue: 25000,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    clientId: "3",
    value: 10000,
    status: "Completed",
    contractors: [],
    contractorHours: [],
    netValue: 10000,
  },
];

const statusColumns = ["Planning", "In Progress", "Completed"];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (!storedProjects) {
      localStorage.setItem("projects", JSON.stringify(initialProjects));
      setProjects(initialProjects);
    } else {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  const getProjectsByStatus = (status: string) => {
    return projects.filter((project) => project.status === status);
  };

  const calculateColumnNetValue = (status: string) => {
    return getProjectsByStatus(status).reduce((sum, project) => {
      return sum + (project.netValue || project.value);
    }, 0);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id.toString() === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "N/A";
  };

  const getContractorNames = (contractorIds: string[]) => {
    return contractorIds
      ?.map((id) => {
        const contractor = contractors.find((c: any) => c.id.toString() === id);
        return contractor?.name;
      })
      .filter(Boolean)
      .join(", ") || "No contractors assigned";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleDragStart = (e: React.DragEvent, projectId: number) => {
    e.dataTransfer.setData("projectId", projectId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const projectId = parseInt(e.dataTransfer.getData("projectId"));
    
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? { ...project, status: newStatus }
        : project
    );

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Projects</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-4 h-[calc(100vh-12rem)] overflow-hidden">
        {statusColumns.map((status) => (
          <div
            key={status}
            className="flex-1 flex flex-col min-w-[280px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="mb-3">
              <h2 className="font-semibold text-lg px-2">{status}</h2>
              <div className="text-sm text-muted-foreground px-2 space-y-1">
                <p>{getProjectsByStatus(status).length} projects</p>
                <p>Total Net Value: {formatCurrency(calculateColumnNetValue(status))}</p>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4 p-2">
                {getProjectsByStatus(status).map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                  >
                    <Link to={`/projects/${project.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{project.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Client: {getClientName(project.clientId)}</p>
                            <p>Value: {formatCurrency(project.value)}</p>
                            <p>Net Value: {formatCurrency(project.netValue || project.value)}</p>
                            <p>Team: {getContractorNames(project.contractors)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
