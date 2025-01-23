import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const project = mockProjects.find((p) => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/projects">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-medium">{project.client}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Value</p>
            <p className="font-medium">${project.value}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{project.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default ProjectDetails;