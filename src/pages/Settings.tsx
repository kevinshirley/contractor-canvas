import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const savedSkills = localStorage.getItem("availableSkills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill");
      return;
    }

    if (skills.includes(newSkill.trim())) {
      toast.error("This skill already exists");
      return;
    }

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    localStorage.setItem("availableSkills", JSON.stringify(updatedSkills));
    setNewSkill("");
    toast.success("Skill added successfully");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    localStorage.setItem("availableSkills", JSON.stringify(updatedSkills));
    toast.success("Skill removed successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Skills</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add a new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill();
              }
            }}
          />
          <Button onClick={handleAddSkill}>Add Skill</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;