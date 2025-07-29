
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RegistrationSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationSuccessDialog = ({ open, onClose }: RegistrationSuccessDialogProps) => {
  const programs = [
    {
      id: 'intermediate',
      title: 'Intermediate Level Exam (Grade 9 to 10 NCFE-25)',
      duration: '30 minutes'
    },
    {
      id: 'junior',
      title: 'Junior Level Exam (Grade 6 to 8 NCFE-25)',
      duration: '30 minutes'
    },
    {
      id: 'senior',
      title: 'Senior Level Exam (Grade 11 to 12 NCFE-25)',
      duration: '30 minutes'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="mb-6">
            <img 
              src="/assets/b15c797a-a81e-48b5-bc52-8e9a6db24d5b.png" 
              alt="National Financial Literacy Olympiad 2025" 
              className="w-full h-auto rounded-lg mb-4"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800 mb-4">
            Available Programs
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {program.title}
                </h3>
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{program.duration}</span>
                </div>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                onClick={() => {
                  // console.log(`Registering for ${program.id}`);
                  // Handle registration logic here
                }}
              >
                Register
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Exam Online. All rights reserved.
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccessDialog;
