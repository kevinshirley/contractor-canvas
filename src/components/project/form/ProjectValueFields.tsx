import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormSchema } from "../types";
import { useEffect } from "react";

type ProjectValueFieldsProps = {
  form: UseFormReturn<FormSchema>;
  netValue: number;
  onValueChange?: (value: number) => void;
};

export const ProjectValueFields = ({ form, netValue, onValueChange }: ProjectValueFieldsProps) => {
  const value = useWatch({
    control: form.control,
    name: "value"
  });

  useEffect(() => {
    if (onValueChange && value) {
      onValueChange(parseFloat(value) || 0);
    }
  }, [value, onValueChange]);

  return (
    <>
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Value ($)</FormLabel>
            <FormControl>
              <Input type="number" min="0" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Net Project Value</FormLabel>
        <Input
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(netValue)}
          readOnly
          disabled
        />
      </div>
    </>
  );
};