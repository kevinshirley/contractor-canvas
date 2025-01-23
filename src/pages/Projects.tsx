import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

type Project = {
  id: number;
  name: string;
  client: string;
  value: number;
  status: string;
};

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    client: "Acme Corp",
    value: 15000,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "TechStart",
    value: 25000,
    status: "Planning",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    client: "GrowthCo",
    value: 10000,
    status: "Completed",
  },
];

const statusColumns = ["Planning", "In Progress", "Completed"];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Initialize localStorage with mock data if empty
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)] overflow-hidden">
        {statusColumns.map((status) => (
          <div
            key={status}
            className="flex-1 flex flex-col min-w-[300px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="mb-3">
              <h2 className="font-semibold text-lg px-2">{status}</h2>
              <p className="text-sm text-muted-foreground px-2">
                {getProjectsByStatus(status).length} projects
              </p>
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
                            <p>Client: {project.client}</p>
                            <p>Value: ${project.value}</p>
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