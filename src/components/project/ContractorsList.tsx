import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X } from "lucide-react";

type ContractorsListProps = {
  contractors: any[];
  selectedContractors: string[];
  contractorHours: Array<{ 
    contractorId: string; 
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>;
  onAddContractor: (contractorId: string) => void;
  onRemoveContractor: (contractorId: string) => void;
  onUpdateHours: (contractorId: string, hours: number) => void;
  onUpdateBillingType: (contractorId: string, billingType: 'hourly' | 'fixed') => void;
  onUpdateFixedAmount: (contractorId: string, amount: number) => void;
};

export const ContractorsList = ({
  contractors,
  selectedContractors,
  contractorHours,
  onAddContractor,
  onRemoveContractor,
  onUpdateHours,
  onUpdateBillingType,
  onUpdateFixedAmount,
}: ContractorsListProps) => {
  const calculateTotalAmount = (contractor: any, contractorHour: any) => {
    if (contractorHour.billingType === 'fixed') {
      return contractorHour.fixedAmount || 0;
    }
    const rate = parseFloat(contractor.rate.replace(/[^0-9.]/g, ''));
    return rate * contractorHour.hours;
  };

  return (
    <div className="space-y-2">
      <Label>Contractors and Hours</Label>
      <Select onValueChange={onAddContractor}>
        <SelectTrigger>
          <SelectValue placeholder="Add contractors" />
        </SelectTrigger>
        <SelectContent>
          {contractors
            .filter((contractor: any) => !selectedContractors.includes(contractor.id.toString()))
            .map((contractor: any) => (
              <SelectItem
                key={contractor.id}
                value={contractor.id.toString()}
              >
                {contractor.name} - {contractor.specialty}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="mt-2 space-y-2">
        {selectedContractors.map((contractorId) => {
          const contractor = contractors.find(
            (c: any) => c.id.toString() === contractorId
          );
          const contractorHour = contractorHours.find(
            ch => ch.contractorId === contractorId
          );
          
          if (!contractor || !contractorHour) return null;
          
          const totalAmount = calculateTotalAmount(contractor, contractorHour);

          return (
            <div
              key={contractorId}
              className="flex flex-col bg-secondary p-2 rounded-md"
            >
              <div className="flex items-center justify-between">
                <span className="block">
                  {contractor.name} - {contractor.specialty}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveContractor(contractorId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2">
                <ToggleGroup
                  type="single"
                  value={contractorHour.billingType}
                  onValueChange={(value) => {
                    if (value) onUpdateBillingType(contractorId, value as 'hourly' | 'fixed');
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="hourly">Hourly Rate</ToggleGroupItem>
                  <ToggleGroupItem value="fixed">Fixed Amount</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="flex items-center gap-2 mt-2">
                {contractorHour.billingType === 'hourly' ? (
                  <>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Hours"
                      className="w-24"
                      value={contractorHour.hours || ""}
                      onChange={(e) => onUpdateHours(contractorId, parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-sm text-muted-foreground">
                      hours @ {contractor.rate}/hr
                    </span>
                  </>
                ) : (
                  <Input
                    type="number"
                    min="0"
                    placeholder="Fixed Amount"
                    className="w-32"
                    value={contractorHour.fixedAmount || ""}
                    onChange={(e) => onUpdateFixedAmount(contractorId, parseFloat(e.target.value) || 0)}
                  />
                )}
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Total Amount: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalAmount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};