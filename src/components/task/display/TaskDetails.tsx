import { DollarSign, User, FileText } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

type TaskDetailsProps = {
  client: any;
  taskValue: number;
  netValue: number;
  totalContractorCost: number;
  description?: string;
  parentTask?: { id: string; name: string; } | null;
};

export const TaskDetailsView = ({
  client,
  taskValue,
  netValue,
  totalContractorCost,
  description,
  parentTask,
}: TaskDetailsProps) => {
  return (
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
          
          {parentTask && (
            <>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <FileText className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">This is a subtask of</p>
                  <Link to={`/tasks/${parentTask.id}`} className="text-blue-500 hover:underline">
                    {parentTask.name}
                  </Link>
                </div>
              </div>
              
              <Separator />
            </>
          )}
          
          {description && (
            <>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <FileText className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Description</p>
                  <p className="whitespace-pre-wrap">{description}</p>
                </div>
              </div>
              
              <Separator />
            </>
          )}
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <DollarSign className="h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Task Value</p>
              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taskValue)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <DollarSign className="h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Net Value</p>
              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netValue)}</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};