import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "../types";

type ClientFieldProps = {
  form: UseFormReturn<FormSchema>;
  clients: any[];
};

export const ClientField = ({ form, clients }: ClientFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {clients.map((client: any) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.firstName} {client.lastName} - {client.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};