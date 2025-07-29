import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Lock, Eye, Camera, Server, AlertTriangle } from 'lucide-react';

interface GDPRComplianceProps {
  onConsent: (granted: boolean) => void;
  showModal?: boolean;
}

const GDPRCompliance = ({ onConsent, showModal = false }: GDPRComplianceProps) => {
  const [isOpen, setIsOpen] = useState(showModal);
  const [consents, setConsents] = useState({
    essential: true, // Always true for exam functionality
    camera: false,
    monitoring: false,
    dataStorage: false,
    analytics: false
  });

  const dataProcessingItems = [
    {
      icon: <Camera className="w-5 h-5 text-blue-500" />,
      title: "Camera Access",
      description: "We capture images during the exam for identity verification and monitoring purposes.",
      required: true,
      key: 'camera'
    },
    {
      icon: <Eye className="w-5 h-5 text-orange-500" />,
      title: "Behavior Monitoring", 
      description: "We track tab switches, window focus changes, and other behavioral data to ensure exam integrity.",
      required: true,
      key: 'monitoring'
    },
    {
      icon: <Server className="w-5 h-5 text-green-500" />,
      title: "Data Storage",
      description: "Exam responses, timestamps, and monitoring data are stored securely for evaluation and audit purposes.",
      required: true,
      key: 'dataStorage'
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: "Analytics",
      description: "Anonymous usage data to improve exam experience and platform security.",
      required: false,
      key: 'analytics'
    }
  ];

  const handleConsentChange = (key: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const handleAccept = () => {
    const requiredConsents = dataProcessingItems
      .filter(item => item.required)
      .every(item => consents[item.key as keyof typeof consents]);

    if (requiredConsents) {
      localStorage.setItem('gdpr-consent', JSON.stringify({
        ...consents,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
      onConsent(true);
      setIsOpen(false);
    }
  };

  const handleReject = () => {
    onConsent(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const existingConsent = localStorage.getItem('gdpr-consent');
    if (!existingConsent && showModal) {
      setIsOpen(true);
    }
  }, [showModal]);

  const allRequiredConsentsGiven = dataProcessingItems
    .filter(item => item.required)
    .every(item => consents[item.key as keyof typeof consents]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Data Protection & Privacy Consent</span>
          </DialogTitle>
          <DialogDescription>
            In accordance with GDPR and data protection regulations, we need your consent for data processing during the examination.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Your Rights Under GDPR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• <strong>Right to Access:</strong> Request copies of your personal data</p>
              <p>• <strong>Right to Rectification:</strong> Request correction of inaccurate data</p>
              <p>• <strong>Right to Erasure:</strong> Request deletion of your data (subject to legal obligations)</p>
              <p>• <strong>Right to Restrict Processing:</strong> Request limitation of data processing</p>
              <p>• <strong>Right to Data Portability:</strong> Request transfer of your data</p>
              <p>• <strong>Right to Object:</strong> Object to processing of your data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Processing Purposes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataProcessingItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {item.icon}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        checked={consents[item.key as keyof typeof consents]}
                        onCheckedChange={(checked) => handleConsentChange(item.key, checked as boolean)}
                        disabled={item.required && item.key === 'essential'}
                      />
                      <label htmlFor={item.key} className="text-sm">
                        {item.required ? 'Required for exam participation' : 'I consent to this processing'}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Security & Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• All data is encrypted in transit and at rest using industry-standard AES-256 encryption</p>
              <p>• Images and monitoring data are retained for 90 days for audit purposes, then automatically deleted</p>
              <p>• Exam responses are retained for 5 years as per examination board requirements</p>
              <p>• Access to your data is restricted to authorized personnel only</p>
              <p>• We implement regular security audits and vulnerability assessments</p>
              <p>• Data is processed within EU jurisdiction in compliance with GDPR</p>
            </CardContent>
          </Card>

          {!allRequiredConsentsGiven && (
            <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                You must consent to all required data processing to participate in the examination.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReject}>
            Decline & Exit
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!allRequiredConsentsGiven}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRCompliance;