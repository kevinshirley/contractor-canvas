import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

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
};

const initialTasks: Task[] = [
  {
    id: 1,
    name: "Website Redesign",
    clientId: "1",
    value: 15000,
    status: "In Progress",
    contractors: [],
    contractorHours: [],
    netValue: 15000,
  },
  {
    id: 2,
    name: "Mobile App Development",
    clientId: "2",
    value: 25000,
    status: "Planning",
    contractors: [],
    contractorHours: [],
    netValue: 25000,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    clientId: "3",
    value: 10000,
    status: "Completed",
    contractors: [],
    contractorHours: [],
    netValue: 10000,
  },
];

const statusColumns = ["Planning", "In Progress", "Completed"];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (!storedTasks) {
      localStorage.setItem("tasks", JSON.stringify(initialTasks));
      setTasks(initialTasks);
    } else {
      const parsedTasks = JSON.parse(storedTasks);
      // Ensure all values and netValues are numbers
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Tasks</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/tasks/new">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-4 h-[calc(100vh-12rem)] overflow-hidden">
        {statusColumns.map((status) => (
          <div
            key={status}
            className="flex-1 flex flex-col min-w-[280px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="mb-3">
              <h2 className="font-semibold text-lg px-2">{status}</h2>
              <div className="text-sm text-muted-foreground px-2 space-y-1">
                <p>{getTasksByStatus(status).length} tasks</p>
                <p>Total Net Value: {formatCurrency(calculateColumnNetValue(status))}</p>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4 p-2">
                {getTasksByStatus(status).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <Link to={`/tasks/${task.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{task.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Client: {getClientName(task.clientId)}</p>
                            <p>Value: {formatCurrency(task.value)}</p>
                            <p>Net Value: {formatCurrency(task.netValue || task.value)}</p>
                            <p>Team: {getContractorNames(task.contractors)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;