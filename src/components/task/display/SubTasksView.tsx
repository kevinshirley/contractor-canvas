import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { SubTask } from "../types";

type SubTasksViewProps = {
  subTasks: SubTask[];
  contractors: any[];
  onUpdateSubTask?: (subTask: SubTask) => void;
  readonly?: boolean;
};

export const SubTasksView = ({ 
  subTasks, 
  contractors,
  onUpdateSubTask, 
  readonly = false 
}: SubTasksViewProps) => {
  if (!subTasks?.length) return null;

  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sub Tasks</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {subTasks.map((subTask) => {
            const assignedContractor = contractors.find(
              (c: any) => c.id.toString() === subTask.contractorId
            );

            return (
              <Card 
                key={subTask.id}
                className={`p-4 ${subTask.completed ? "opacity-70" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={subTask.completed}
                    onCheckedChange={
                      readonly
                        ? undefined
                        : (checked) =>
                            onUpdateSubTask?.({ ...subTask, completed: checked as boolean })
                    }
                    disabled={readonly}
                  />
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{subTask.name}</p>
                    {subTask.description && (
                      <p className="text-sm text-muted-foreground">{subTask.description}</p>
                    )}
                    {assignedContractor && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Assigned to: {assignedContractor.name}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </CardContent>
  );
};