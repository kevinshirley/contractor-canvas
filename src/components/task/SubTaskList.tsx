import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { SubTask } from "./types";

type SubTaskListProps = {
  subTasks: SubTask[];
  onAddSubTask: (subTask: SubTask) => void;
  onRemoveSubTask: (id: string) => void;
  onUpdateSubTask: (subTask: SubTask) => void;
};

export const SubTaskList = ({
  subTasks,
  onAddSubTask,
  onRemoveSubTask,
  onUpdateSubTask,
}: SubTaskListProps) => {
  const [newSubTaskName, setNewSubTaskName] = useState("");
  const [newSubTaskDescription, setNewSubTaskDescription] = useState("");

  const handleAddSubTask = () => {
    if (newSubTaskName.trim()) {
      onAddSubTask({
        id: Date.now().toString(),
        name: newSubTaskName,
        description: newSubTaskDescription,
        completed: false,
      });
      setNewSubTaskName("");
      setNewSubTaskDescription("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sub Tasks</h3>
      
      <div className="space-y-4">
        {subTasks.map((subTask) => (
          <div key={subTask.id} className="flex items-start space-x-2 border p-3 rounded-md">
            <Checkbox
              checked={subTask.completed}
              onCheckedChange={(checked) =>
                onUpdateSubTask({ ...subTask, completed: checked as boolean })
              }
            />
            <div className="flex-1 space-y-1">
              <Input
                value={subTask.name}
                onChange={(e) =>
                  onUpdateSubTask({ ...subTask, name: e.target.value })
                }
                className="font-medium"
              />
              <Textarea
                value={subTask.description || ""}
                onChange={(e) =>
                  onUpdateSubTask({ ...subTask, description: e.target.value })
                }
                placeholder="Description (optional)"
                className="min-h-[60px]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSubTask(subTask.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-start space-x-2">
        <div className="flex-1 space-y-2">
          <Input
            value={newSubTaskName}
            onChange={(e) => setNewSubTaskName(e.target.value)}
            placeholder="New sub task name"
          />
          <Textarea
            value={newSubTaskDescription}
            onChange={(e) => setNewSubTaskDescription(e.target.value)}
            placeholder="Description (optional)"
            className="min-h-[60px]"
          />
        </div>
        <Button onClick={handleAddSubTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sub Task
        </Button>
      </div>
    </div>
  );
};