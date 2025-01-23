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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  specialty: z.string().min(1, "Specialty is required"),
  currency: z.string().min(1, "Currency is required"),
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

const ContractorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Get existing contractors from localStorage
  const contractors = JSON.parse(localStorage.getItem('contractors') || '[]');
  const contractor = contractors.find((c: any) => c.id === Number(id)) || {
    id: Number(id),
    name: "",
    email: "",
    specialty: "",
    currency: "USD",
    rate: "$0.00",
  };

  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contractor.name,
      email: contractor.email,
      specialty: contractor.specialty,
      currency: contractor.currency || "USD",
      rate: contractor.rate.replace(/[^0-9.]/g, ''),
    },
  });

  const onSubmit = (data: ContractorFormValues) => {
    // Format the rate to include the currency symbol
    const formattedData = {
      ...data,
      rate: `${data.currency === 'USD' ? '$' : data.currency}${parseFloat(data.rate).toFixed(2)}`,
      id: Number(id),
    };

    // Update contractor in localStorage
    const updatedContractors = contractors.map((c: any) => 
      c.id === Number(id) ? formattedData : c
    );
    localStorage.setItem('contractors', JSON.stringify(updatedContractors));

    toast.success("Contractor updated successfully");
    navigate("/contractors");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Contractor</h1>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
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
                    <FormLabel>Hourly Rate</FormLabel>
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
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/contractors")}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContractorDetails;