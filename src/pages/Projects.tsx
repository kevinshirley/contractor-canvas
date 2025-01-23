import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockProjects = [
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

const Projects = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">{project.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Client: {project.client}</p>
                  <p>Value: ${project.value}</p>
                  <p>Status: {project.status}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;