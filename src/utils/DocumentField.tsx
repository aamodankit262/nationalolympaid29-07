// DocumentField.tsx
import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DocumentField({ label, value, isEditing, accept, onChange, baseUrl }: {
  label: string;
  value: string | File;
  isEditing: boolean;
  accept: string;
  onChange: (file: File | '') => void;
  baseUrl: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing ? (
        <Input
          type="file"
          accept={accept}
          onChange={e => onChange(e.target.files?.[0] || '')}
        />
      ) : (
        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
          <FileText className="w-4 h-4 text-gray-500" />
          {typeof value === 'string' && value ? (
            <a
              href={value.startsWith('http') ? value : baseUrl + value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View/Download
            </a>
          ) : (
            <span className="text-gray-600">Not uploaded</span>
          )}
        </div>
      )}
    </div>
  );
}