import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Edit } from "lucide-react";

type ProjectHeaderProps = {
  name: string;
  status: string;
  onEdit: () => void;
};

export const ProjectHeader = ({ name, status, onEdit }: ProjectHeaderProps) => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{name}</h2>
          <Badge variant="outline" className="text-sm">
            {status}
          </Badge>
        </div>
        <Button onClick={onEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </Button>
      </div>
    </CardHeader>
  );
};