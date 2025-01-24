import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { SubTask } from "../types";

type SubTasksViewProps = {
  subTasks: SubTask[];
  onUpdateSubTask?: (subTask: SubTask) => void;
  readonly?: boolean;
};

export const SubTasksView = ({ subTasks, onUpdateSubTask, readonly = false }: SubTasksViewProps) => {
  if (!subTasks?.length) return null;

  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sub Tasks</h3>
        {subTasks.map((subTask, index) => (
          <div key={subTask.id}>
            <div className="flex items-start space-x-3">
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
              <div className="space-y-1">
                <p className="font-medium">{subTask.name}</p>
                {subTask.description && (
                  <p className="text-sm text-muted-foreground">{subTask.description}</p>
                )}
              </div>
            </div>
            {index < subTasks.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </CardContent>
  );
};