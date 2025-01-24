import { DollarSign, User } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ProjectDetailsProps = {
  client: any;
  projectValue: number;
  netValue: number;
  totalContractorCost: number;
};

export const ProjectDetailsView = ({
  client,
  projectValue,
  netValue,
  totalContractorCost,
}: ProjectDetailsProps) => {
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
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <DollarSign className="h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Project Value</p>
              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projectValue)}</p>
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