import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SubTask } from "./types";

type SubTaskListProps = {
  subTasks: SubTask[];
  contractors: any[];
  onAddSubTask: (subTask: SubTask) => void;
  onRemoveSubTask: (id: string) => void;
  onUpdateSubTask: (subTask: SubTask) => void;
};

export const SubTaskList = ({
  subTasks,
  contractors,
  onAddSubTask,
  onRemoveSubTask,
  onUpdateSubTask,
}: SubTaskListProps) => {
  const [newSubTaskName, setNewSubTaskName] = useState("");
  const [newSubTaskDescription, setNewSubTaskDescription] = useState("");
  const [newSubTaskContractorId, setNewSubTaskContractorId] = useState<string>("");

  const handleAddSubTask = () => {
    if (newSubTaskName.trim()) {
      onAddSubTask({
        id: Date.now().toString(),
        name: newSubTaskName,
        description: newSubTaskDescription,
        completed: false,
        contractorId: newSubTaskContractorId || undefined,
      });
      setNewSubTaskName("");
      setNewSubTaskDescription("");
      setNewSubTaskContractorId("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sub Tasks</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {subTasks.map((subTask) => (
          <Card key={subTask.id} className={subTask.completed ? "opacity-70" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={subTask.completed}
                  onCheckedChange={(checked) =>
                    onUpdateSubTask({ ...subTask, completed: checked as boolean })
                  }
                />
                <div className="flex-1 space-y-2">
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
                  <Select
                    value={subTask.contractorId}
                    onValueChange={(value) =>
                      onUpdateSubTask({ ...subTask, contractorId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractors.map((contractor: any) => (
                        <SelectItem key={contractor.id} value={contractor.id.toString()}>
                          {contractor.name} - {contractor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveSubTask(subTask.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
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
            <Select
              value={newSubTaskContractorId}
              onValueChange={setNewSubTaskContractorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign contractor (optional)" />
              </SelectTrigger>
              <SelectContent>
                {contractors.map((contractor: any) => (
                  <SelectItem key={contractor.id} value={contractor.id.toString()}>
                    {contractor.name} - {contractor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddSubTask} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Sub Task
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};