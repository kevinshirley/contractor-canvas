import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

type ContractorHours = {
  contractorId: string;
  hours: number;
}

type Task = {
  id: number;
  name: string;
  clientId: string;
  value: number;
  status: string;
  contractors: string[];
  contractorHours?: ContractorHours[];
  netValue: number;
  parentTaskId?: string;
};

const statusColumns = ["Planning", "In Progress", "Completed"];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      const validatedTasks = parsedTasks.map((task: Task) => ({
        ...task,
        value: Number(task.value),
        netValue: Number(task.netValue || task.value)
      }));
      setTasks(validatedTasks);
    }
  }, []);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const calculateColumnNetValue = (status: string) => {
    return getTasksByStatus(status).reduce((sum, task) => {
      return sum + Number(task.netValue || task.value);
    }, 0);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id.toString() === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "N/A";
  };

  const getContractorNames = (contractorIds: string[]) => {
    return contractorIds
      ?.map((id) => {
        const contractor = contractors.find((c: any) => c.id.toString() === id);
        return contractor?.name;
      })
      .filter(Boolean)
      .join(", ") || "No contractors assigned";
  };

  const getParentTaskName = (parentTaskId?: string) => {
    if (!parentTaskId) return null;
    const parentTask = tasks.find(t => t.id.toString() === parentTaskId);
    return parentTask?.name;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Tasks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Tasks</h1>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/tasks/new">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {statusColumns.map((status) => (
          <div
            key={status}
            className="flex flex-col bg-card rounded-lg border shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold text-lg">{status}</h2>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center justify-between">
                  <span>Tasks: {getTasksByStatus(status).length}</span>
                  <Badge variant="secondary">
                    {formatCurrency(calculateColumnNetValue(status))}
                  </Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {getTasksByStatus(status).map((task) => {
                  const parentTaskName = getParentTaskName(task.parentTaskId);
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="group"
                    >
                      <Link to={`/tasks/${task.id}`}>
                        <Card className="transition-all duration-200 hover:shadow-md group-hover:border-primary/20 group-active:scale-98">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                {task.name}
                              </h3>
                              {parentTaskName && (
                                <Badge variant="outline" className="text-xs">
                                  Subtask of: {parentTaskName}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p className="flex justify-between">
                                <span>Client:</span>
                                <span className="font-medium text-foreground">
                                  {getClientName(task.clientId)}
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span>Value:</span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(task.value)}
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span>Net Value:</span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(task.netValue || task.value)}
                                </span>
                              </p>
                              <div className="pt-2 border-t">
                                <p className="text-xs">
                                  Team: {getContractorNames(task.contractors)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;