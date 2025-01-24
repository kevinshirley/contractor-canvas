import { Card, CardContent } from "@/components/ui/card";

type TaskContractorsProps = {
  selectedContractors: string[];
  contractors: any[];
  contractorHours: Array<{
    contractorId: string;
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>;
};

export const TaskContractors = ({
  selectedContractors,
  contractors,
  contractorHours,
}: TaskContractorsProps) => {
  return (
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
  );
};