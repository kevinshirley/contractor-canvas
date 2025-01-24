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
import { Edit, Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const ClientDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState<any>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const foundClient = clients.find((c: any) => c.id === id);
    
    if (foundClient) {
      setClient(foundClient);
      form.reset(foundClient);
    } else {
      navigate("/clients");
      toast({
        title: "Error",
        description: "Client not found",
      });
    }
  }, [id, form, navigate, toast]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    const updatedClients = clients.map((client: any) =>
      client.id === id ? { ...client, ...values } : client
    );
    
    localStorage.setItem("clients", JSON.stringify(updatedClients));

    toast({
      title: "Success",
      description: "Client has been updated successfully",
    });

    setIsEditing(false);
  };

  const renderDisplayView = () => {
    if (!client) return null;

    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              {`${client.firstName} ${client.lastName}`}
            </CardTitle>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Building2 className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Company</p>
                <p>{client.company}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Email</p>
                <p>{client.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Phone</p>
                <p>{client.phone}</p>
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
            <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client ? `${client.firstName} ${client.lastName}` : 'Client Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc" {...field} />
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
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Client</Button>
            </div>
          </form>
        </Form>
      ) : (
        renderDisplayView()
      )}
    </div>
  );
};

export default ClientDetails;
