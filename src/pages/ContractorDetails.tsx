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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Edit, DollarSign, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rate: z.string().min(1, "Rate is required"),
  skills: z.string().min(2, "Skills must be at least 2 characters"),
});

const ContractorDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [contractor, setContractor] = useState<any>(null);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rate: "",
    },
  });

  useEffect(() => {
    const savedSkills = localStorage.getItem("availableSkills");
    if (savedSkills) {
      setAvailableSkills(JSON.parse(savedSkills));
    }

    const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");
    const foundContractor = contractors.find((c: any) => c.id.toString() === id?.toString());
    
    if (foundContractor) {
      setContractor(foundContractor);
      setSelectedSkills(foundContractor.skills || []);
      form.reset({
        ...foundContractor,
      });
    } else {
      navigate("/contractors");
      toast({
        title: "Error",
        description: "Contractor not found",
      });
    }
  }, [id, form, navigate, toast]);

  const handleSkillSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedSkills.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one skill",
        variant: "destructive",
      });
      return;
    }

    const contractors = JSON.parse(localStorage.getItem("contractors") || "[]");
    const updatedContractors = contractors.map((contractor: any) =>
      contractor.id.toString() === id?.toString() 
        ? { 
            ...contractor, 
            ...values,
            skills: selectedSkills,
          } 
        : contractor
    );
    
    localStorage.setItem("contractors", JSON.stringify(updatedContractors));
    
    toast({
      title: "Success",
      description: "Contractor has been updated successfully",
    });

    setIsEditing(false);
    setContractor({ 
      ...contractor, 
      ...values,
      skills: selectedSkills,
    });
  };

  const renderDisplayView = () => {
    if (!contractor) return null;

    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{contractor.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(contractor.skills) 
                  ? contractor.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))
                  : (
                    <Badge variant="secondary" className="text-sm">
                      {contractor.skills}
                    </Badge>
                  )
                }
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Contractor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-muted-foreground">
              <DollarSign className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Rate</p>
                <p>{contractor.rate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Briefcase className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(contractor.skills) 
                    ? contractor.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))
                    : (
                      <Badge variant="secondary" className="text-sm">
                        {contractor.skills}
                      </Badge>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/contractors">Contractors</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{contractor?.name || 'Contractor Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Contractor Name" {...field} />
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
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="Rate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Skills</FormLabel>
              <Select onValueChange={handleSkillSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skills" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills
                    .filter(skill => !selectedSkills.includes(skill))
                    .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </FormItem>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Contractor</Button>
            </div>
          </form>
        </Form>
      ) : (
        renderDisplayView()
      )}
    </div>
  );
};

export default ContractorDetails;
