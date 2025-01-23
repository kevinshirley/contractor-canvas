import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  specialty: z.string().min(1, "Specialty is required"),
  rate: z.string().refine(
    (value) => {
      const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      return !isNaN(numValue) && numValue > 0;
    },
    {
      message: "Rate must be a valid positive number",
    }
  ),
});

type ContractorFormValues = z.infer<typeof formSchema>;

const NewContractor = () => {
  const navigate = useNavigate();
  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialty: "",
      rate: "",
    },
  });

  const onSubmit = (data: ContractorFormValues) => {
    // Format the rate to include the dollar sign
    const formattedData = {
      ...data,
      rate: `$${parseFloat(data.rate).toFixed(2)}`,
      id: Date.now(), // Use timestamp as a simple unique ID
    };

    // Get existing contractors
    const existingContractors = JSON.parse(localStorage.getItem('contractors') || '[]');
    
    // Add new contractor
    const updatedContractors = [...existingContractors, formattedData];
    
    // Save to localStorage
    localStorage.setItem('contractors', JSON.stringify(updatedContractors));
    
    toast.success("Contractor created successfully");
    navigate("/contractors");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Contractor</h1>
      </div>

      <div className="max-w-2xl rounded-lg border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="75.00"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/contractors")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Contractor</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewContractor;