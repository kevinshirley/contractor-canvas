import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "../types";

type ProjectDescriptionFieldProps = {
  form: UseFormReturn<FormSchema>;
};

export const ProjectDescriptionField = ({ form }: ProjectDescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter project details..."
              className="min-h-[100px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};