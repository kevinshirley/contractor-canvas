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
import { X } from "lucide-react";

type ContractorsListProps = {
  contractors: any[];
  selectedContractors: string[];
  contractorHours: Array<{ contractorId: string; hours: number }>;
  onAddContractor: (contractorId: string) => void;
  onRemoveContractor: (contractorId: string) => void;
  onUpdateHours: (contractorId: string, hours: number) => void;
};

export const ContractorsList = ({
  contractors,
  selectedContractors,
  contractorHours,
  onAddContractor,
  onRemoveContractor,
  onUpdateHours,
}: ContractorsListProps) => {
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
          return contractor ? (
            <div
              key={contractorId}
              className="flex items-center justify-between bg-secondary p-2 rounded-md"
            >
              <div className="flex-1">
                <span className="block">
                  {contractor.name} - {contractor.specialty}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Hours"
                    className="w-24"
                    value={contractorHour?.hours || ""}
                    onChange={(e) => onUpdateHours(contractorId, parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-sm text-muted-foreground">
                    hours @ {contractor.rate}/hr
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveContractor(contractorId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};