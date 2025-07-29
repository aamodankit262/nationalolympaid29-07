
import { useState } from 'react';
import { Users, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedRole === 'student') {
      navigate('/register', { state: { role: selectedRole } });
    } else if (selectedRole === 'institute') {
    navigate('/register', { state: { role: selectedRole } });
    } else if (selectedRole === 'resource') {
      navigate('/register', { state: { role: selectedRole } });
    }
  };

  const roles = [
    {
      id: 'student',
      title: 'Register As Students',
      description: 'Join as a student to begin your learning journey.',
      icon: Users,
      selected: selectedRole === 'student'
    },
    // {
    //   id: 'institute',
    //   title: 'Register As Institutes',
    //   description: 'Set up your institute profile in just a few steps',
    //   icon: Building2,
    //   selected: selectedRole === 'institute'
    // },
    {
      id: 'resource',
      title: 'Register As Resource Persons',
      description: 'Become a resource person and help empower others',
      icon: UserCog,
      selected: selectedRole === 'resource'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center pt-32 pb-8 px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Sign up to your Account 👋
              </h1>
              <p className="text-gray-600">
                Select your user type to proceed with registration.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select your Role</h3>
              
              <div className="space-y-3">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        role.selected 
                          ? 'border-[#1B7A8C] bg-[#1B7A8C]/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            role.selected ? 'bg-[#1B7A8C] text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          role.selected 
                            ? 'bg-[#1B7A8C] border-[#1B7A8C]' 
                            : 'border-gray-300'
                        }`}>
                          {role.selected && (
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-[#1B7A8C]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!selectedRole}
              className="w-full bg-[#1B4A5C] hover:bg-[#1B4A5C]/90 text-white py-3 rounded-lg font-semibold"
            >
              Save And Next
            </Button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                  Login now.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
