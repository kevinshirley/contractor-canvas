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
  if (!selectedContractors.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contractors</h3>
      <div className="grid gap-4 md:grid-cols-2">
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
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium">{contractor.name}</h4>
                    <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      {hours.billingType === 'fixed' 
                        ? 'Fixed Amount:'
                        : 'Rate:'
                      }
                      <span className="float-right">
                        {hours.billingType === 'fixed' 
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(hours.fixedAmount || 0)
                          : `${hours.hours} hours @ ${contractor.rate}`
                        }
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total:
                      <span className="float-right">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                      </span>
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