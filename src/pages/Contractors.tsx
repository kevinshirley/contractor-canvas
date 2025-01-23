import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, User } from "lucide-react";
import { Link } from "react-router-dom";

// Temporary mock data - replace with actual data fetching
const contractors = [
  { id: 1, name: "John Doe", email: "john@example.com", specialty: "Frontend Development", rate: "$75/hr" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", specialty: "Backend Development", rate: "$85/hr" },
];

const Contractors = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contractors</h1>
        <Link to="/contractors/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contractor
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {contractor.name}
                </TableCell>
                <TableCell>{contractor.email}</TableCell>
                <TableCell>{contractor.specialty}</TableCell>
                <TableCell>{contractor.rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Contractors;