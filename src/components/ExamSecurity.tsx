import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

interface SecurityViolation {
  type: 'tab_switch' | 'copy_paste' | 'right_click' | 'dev_tools' | 'focus_loss' | 'network_change';
  timestamp: Date;
  details?: string;
}

interface ExamSecurityProps {
  onViolation: (violation: SecurityViolation) => void;
  maxViolations?: number;
}

const ExamSecurity = ({ onViolation, maxViolations = 3 }: ExamSecurityProps) => {
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate session token for request validation
  const sessionToken = useState(() => 
    btoa(Date.now() + Math.random().toString(36))
  )[0];

  useEffect(() => {
    let violationCount = 0;

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation('right_click', 'Right-click detected');
    };

    // Prevent copy/paste operations
    const handleKeydown = (e: KeyboardEvent) => {
      // Block common shortcuts
      if (
        (e.ctrlKey || e.metaKey) && 
        ['c', 'v', 'x', 'a', 's', 'p', 'f', 'u', 'i', 'j'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        recordViolation('copy_paste', `Blocked shortcut: Ctrl+${e.key}`);
      }
      
      // Block F12, F11 (dev tools, fullscreen)
      if (['F12', 'F11'].includes(e.key)) {
        e.preventDefault();
        recordViolation('dev_tools', `Blocked key: ${e.key}`);
      }
    };

    // Detect tab switching and window focus changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch', 'Page became hidden');
      }
    };

    const handleBlur = () => {
      recordViolation('focus_loss', 'Window lost focus');
    };

    // Monitor network changes
    const handleOnline = () => {
      recordViolation('network_change', 'Network connection restored');
    };

    const handleOffline = () => {
      recordViolation('network_change', 'Network connection lost');
    };

    // Block drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    // Block text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Detect dev tools (basic check)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        recordViolation('dev_tools', 'Developer tools may be open');
      }
    };

    const recordViolation = (type: SecurityViolation['type'], details?: string) => {
      const violation: SecurityViolation = {
        type,
        timestamp: new Date(),
        details
      };

      setViolations(prev => {
        const newViolations = [...prev, violation];
        violationCount = newViolations.length;
        
        if (violationCount >= maxViolations) {
          setIsBlocked(true);
          toast({
            title: "Exam Terminated",
            description: "Multiple security violations detected. Exam will be auto-submitted.",
            variant: "destructive",
          });
          
          // Auto-submit exam after delay
          setTimeout(() => {
            navigate('/exam-thank-you');
          }, 3000);
        } else {
          toast({
            title: "Security Warning",
            description: `Violation detected: ${details}. ${maxViolations - violationCount} warnings remaining.`,
            variant: "destructive",
          });
        }

        return newViolations;
      });

      onViolation(violation);
      
      // Log violation to admin server
      logViolationToServer(violation);
    };

    const logViolationToServer = async (violation: SecurityViolation) => {
      try {
        await fetch('/api/admin/security-violations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Token': sessionToken,
            'X-CSRF-Token': getCsrfToken(),
          },
          body: JSON.stringify({
            violation,
            studentId: getCurrentStudentId(),
            examId: getCurrentExamId(),
            userAgent: navigator.userAgent,
            timestamp: violation.timestamp.toISOString()
          }),
        });
      } catch (error) {
        console.error('Failed to log security violation:', error);
      }
    };

    // Set up event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('selectstart', handleSelectStart);

    // Dev tools detection interval
    const devToolsInterval = setInterval(detectDevTools, 5000);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('selectstart', handleSelectStart);
      clearInterval(devToolsInterval);
    };
  }, [onViolation, maxViolations, navigate, toast, sessionToken]);

  // Utility functions (these would be implemented based on your auth system)
  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  };

  const getCurrentStudentId = () => {
    return localStorage.getItem('studentId') || 'anonymous';
  };

  const getCurrentExamId = () => {
    return localStorage.getItem('currentExamId') || 'unknown';
  };

  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-red-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Exam Terminated</h2>
          <p className="text-red-600 mb-4">
            Multiple security violations detected. Your exam has been automatically submitted.
          </p>
          <div className="text-sm text-gray-600">
            <p>Violations: {violations.length}</p>
            <p>Redirecting to results page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {violations.length > 0 && (
        <div className="bg-amber-100 border border-amber-400 rounded-lg p-3 max-w-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Security Warnings: {violations.length}/{maxViolations}
            </span>
          </div>
          {violations.length > 0 && (
            <p className="text-xs text-amber-700 mt-1">
              Last: {violations[violations.length - 1].details}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamSecurity;