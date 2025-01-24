import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/task/TaskForm";
import { TaskHeader } from "@/components/task/display/TaskHeader";
import { TaskDetailsView } from "@/components/task/display/TaskDetails";
import { TaskContractors } from "@/components/task/display/TaskContractors";
import { SubTasksView } from "@/components/task/display/SubTasksView";
import { TaskBreadcrumb } from "@/components/task/display/TaskBreadcrumb";
import { TaskActions } from "@/components/task/display/TaskActions";
import { FormSchema } from "@/components/task/types";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [contractorHours, setContractorHours] = useState<Array<{
    contractorId: string;
    hours: number;
    billingType: 'hourly' | 'fixed';
    fixedAmount?: number;
  }>>([]);
  const [task, setTask] = useState<any>(null);
  const [netValue, setNetValue] = useState<number>(0);
  const [currentTaskValue, setCurrentTaskValue] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  const clients = JSON.parse(localStorage.getItem("clients") || "[]");
  const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const foundTask = tasks.find((p: any) => p.id.toString() === id);
    
    if (foundTask) {
      setTask(foundTask);
      setSelectedContractors(foundTask.contractors || []);
      setContractorHours(foundTask.contractorHours || []);
      setCurrentTaskValue(parseFloat(foundTask.value) || 0);
      calculateNetValue(parseFloat(foundTask.value), foundTask.contractorHours || []);
    } else {
      toast.error("Task not found");
      navigate("/tasks");
    }
  }, [id, navigate]);

  const handleDeleteTask = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updatedTasks = tasks.filter((p: any) => p.id.toString() !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    toast.success("Task deleted successfully");
    navigate("/tasks");
  };

  const calculateNetValue = (taskValue: number, hours: typeof contractorHours) => {
    const totalContractorCost = hours.reduce((acc, curr) => {
      if (curr.billingType === 'fixed') {
        return acc + (curr.fixedAmount || 0);
      }
      const contractor = contractors.find((c: any) => c.id.toString() === curr.contractorId);
      if (!contractor) return acc;
      
      const rate = parseFloat(contractor.rate.replace(/[^0-9.]/g, ''));
      return acc + (rate * curr.hours);
    }, 0);

    setNetValue(taskValue - totalContractorCost);
  };

  const handleTaskValueChange = (value: number) => {
    setCurrentTaskValue(value);
    calculateNetValue(value, contractorHours);
  };

  const onSubmit = (values: FormSchema) => {
    const taskValue = parseFloat(values.value);
    const updatedTask = {
      ...task,
      ...values,
      value: taskValue,
      contractors: selectedContractors,
      contractorHours: contractorHours,
      netValue: netValue,
    };

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updatedTasks = tasks.map((p: any) =>
      p.id.toString() === id ? updatedTask : p
    );

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    toast.success("Task updated successfully");
    setIsEditing(false);
    setTask(updatedTask);
  };

  const client = clients.find((c: any) => c.id === task?.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TaskBreadcrumb isEditing={isEditing} />
        {!isEditing && <TaskActions onDeleteTask={handleDeleteTask} />}
      </div>

      <Card>
        {isEditing ? (
          <TaskForm
            task={task}
            clients={clients}
            onSubmit={onSubmit}
            selectedContractors={selectedContractors}
            netValue={netValue}
            contractors={contractors}
            contractorHours={contractorHours}
            onAddContractor={(contractorId: string) => {
              setSelectedContractors([...selectedContractors, contractorId]);
              const newContractorHour = {
                contractorId,
                hours: 0,
                billingType: 'hourly' as const,
                fixedAmount: 0
              };
              setContractorHours([...contractorHours, newContractorHour]);
              toast.success("Contractor added to task");
            }}
            onRemoveContractor={(contractorId: string) => {
              setSelectedContractors(selectedContractors.filter(id => id !== contractorId));
              const updatedHours = contractorHours.filter(ch => ch.contractorId !== contractorId);
              setContractorHours(updatedHours);
              calculateNetValue(currentTaskValue, updatedHours);
              toast.success("Contractor removed from task");
            }}
            onUpdateHours={(contractorId: string, hours: number) => {
              setContractorHours(
                contractorHours.map((ch) =>
                  ch.contractorId === contractorId ? { ...ch, hours } : ch
                )
              );
            }}
            onValueChange={handleTaskValueChange}
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
        ) : task ? (
          <>
            <TaskHeader
              name={task.name}
              status={task.status}
              onEdit={() => setIsEditing(true)}
            />
            <TaskDetailsView
              client={client}
              taskValue={parseFloat(task.value)}
              netValue={netValue}
              totalContractorCost={currentTaskValue - netValue}
              description={task.description}
            />
            <TaskContractors
              selectedContractors={selectedContractors}
              contractors={contractors}
              contractorHours={contractorHours}
            />
            <SubTasksView
              subTasks={task.subTasks || []}
              onUpdateSubTask={(updatedSubTask) => {
                const updatedSubTasks = (task.subTasks || []).map((st: any) =>
                  st.id === updatedSubTask.id ? updatedSubTask : st
                );
                const updatedTask = { ...task, subTasks: updatedSubTasks };
                setTask(updatedTask);
                
                const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
                const updatedTasks = tasks.map((p: any) =>
                  p.id.toString() === id ? updatedTask : p
                );
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
              }}
            />
          </>
        ) : null}
      </Card>
    </div>
  );
};

export default TaskDetails;