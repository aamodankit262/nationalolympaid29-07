
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';

const Exam = () => {
  const [selectedAnswer, setSelectedAnswer] = useState('D');
  const [timeLeft, setTimeLeft] = useState(35 * 60 + 53); // 35 minutes 53 seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} Minutes ${secs} Seconds`;
  };

  const questionStats = [
    { label: 'Answered', count: '01', color: 'bg-green-500' },
    { label: 'Marked', count: '02', color: 'bg-orange-500' },
    { label: 'Not Visited', count: '02', color: 'bg-blue-500' },
    { label: 'Marked and Answered', count: '01', color: 'bg-yellow-500' },
    { label: 'Not Answered', count: '02', color: 'bg-red-500' }
  ];

  // Generate question grid
  const questionGrid = [];
  for (let i = 1; i <= 30; i++) {
    let bgColor = 'bg-gray-200';
    if (i === 1) bgColor = 'bg-green-500 text-white';
    else if (i === 2 || i === 3) bgColor = 'bg-blue-500 text-white';
    else if (i === 4) bgColor = 'bg-orange-500 text-white';
    else if (i === 5) bgColor = 'bg-green-500 text-white';
    else if (i === 6) bgColor = 'bg-yellow-500 text-white';
    
    questionGrid.push({
      number: i.toString().padStart(2, '0'),
      className: bgColor
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Question 1.</h2>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Report</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                    U
                  </div>
                  <span className="font-medium">User Name</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-6">
                What is the mechanism through which cells differentiate in multicellular organisms?
              </h3>

              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAnswer === option 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium ${
                        selectedAnswer === option ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {option}
                      </div>
                      <span className="text-gray-700">
                        Those responsible for an action that may be catastrophic must prove that it will not harm before proceeding.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Question 1 Of 30</span>
                <br />
                <span>{formatTime(timeLeft)}</span>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                  Mark for Review & Next
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Save And Next
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Submit & View Result
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white shadow-sm p-6">
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
              U
            </div>
            <span className="font-medium">User Name</span>
          </div>

          {/* Question Status */}
          <div className="space-y-3 mb-6">
            {questionStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded ${stat.color}`}></div>
                  <span className="text-sm">{stat.label}</span>
                </div>
                <span className={`w-6 h-6 rounded text-white text-xs flex items-center justify-center ${stat.color}`}>
                  {stat.count}
                </span>
              </div>
            ))}
          </div>

          {/* Section Info */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Section: test</h4>
            <div className="grid grid-cols-6 gap-2">
              {questionGrid.map((question, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded text-xs font-medium ${question.className}`}
                >
                  {question.number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
