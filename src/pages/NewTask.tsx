import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TaskForm } from "@/components/task/TaskForm";

const NewTask = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [netValue, setNetValue] = useState(0);
  const [contractorHours, setContractorHours] = useState<Array<{
    contractorId: string;
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>>([]);

  // Get clients, contractors and tasks from localStorage
  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const handleSubmit = (values: any) => {
    const newTask = {
      id: Date.now(),
      ...values,
      contractors: selectedContractors,
      contractorHours: contractorHours,
      status: "Planning",
    };

    const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localStorage.setItem(
      "tasks",
      JSON.stringify([...existingTasks, newTask])
    );

    toast({
      title: "Success",
      description: "Task created successfully",
    });

    navigate("/tasks");
  };

  const addContractor = (contractorId: string) => {
    if (!selectedContractors.includes(contractorId)) {
      setSelectedContractors([...selectedContractors, contractorId]);
      setContractorHours([
        ...contractorHours,
        {
          contractorId,
          hours: 0,
          billingType: 'hourly',
          fixedAmount: 0
        }
      ]);
      toast({
        title: "Success",
        description: "Contractor added to task",
      });
    }
  };

  const removeContractor = (contractorId: string) => {
    setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
    setContractorHours(contractorHours.filter(ch => ch.contractorId !== contractorId));
    toast({
      title: "Success",
      description: "Contractor removed from task",
    });
  };

  const handleValueChange = (value: number) => {
    setNetValue(value);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tasks">Tasks</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Task</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Task</h1>
        </CardHeader>
        <TaskForm
          task={null}
          clients={clients}
          tasks={tasks}
          onSubmit={handleSubmit}
          selectedContractors={selectedContractors}
          netValue={netValue}
          contractors={contractors}
          contractorHours={contractorHours}
          onAddContractor={addContractor}
          onRemoveContractor={removeContractor}
          onUpdateHours={(contractorId: string, hours: number) => {
            setContractorHours(
              contractorHours.map((ch) =>
                ch.contractorId === contractorId ? { ...ch, hours } : ch
              )
            );
          }}
          onValueChange={handleValueChange}
          onUpdateBillingType={(contractorId: string, billingType: 'hourly' | 'fixed') => {
            setContractorHours(
              contractorHours.map((ch) =>
                ch.contractorId === contractorId ? { ...ch, billingType } : ch
              )
            );
          }}
          onUpdateFixedAmount={(contractorId: string, amount: number) => {
            setContractorHours(
              contractorHours.map((ch) =>
                ch.contractorId === contractorId ? { ...ch, fixedAmount: amount } : ch
              )
            );
          }}
        />
      </Card>
    </div>
  );
};

export default NewTask;