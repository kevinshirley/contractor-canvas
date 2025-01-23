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
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Contractor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  rate: string;
}

const Contractors = () => {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    // Load contractors from localStorage on component mount
    const savedContractors = localStorage.getItem('contractors');
    if (savedContractors) {
      setContractors(JSON.parse(savedContractors));
    }
  }, []);

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
            {contractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No contractors found. Add your first contractor to get started.
                </TableCell>
              </TableRow>
            ) : (
              contractors.map((contractor) => (
                <TableRow 
                  key={contractor.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/contractors/${contractor.id}`)}
                >
                  <TableCell className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {contractor.name}
                  </TableCell>
                  <TableCell>{contractor.email}</TableCell>
                  <TableCell>{contractor.specialty}</TableCell>
                  <TableCell>{contractor.rate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Contractors;