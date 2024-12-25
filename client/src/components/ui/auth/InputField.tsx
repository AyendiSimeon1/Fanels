import { ComponentProps } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends ComponentProps<'input'> {
  label: string;
  icon: LucideIcon;
}

export const InputField = ({ label, icon: Icon, ...props }: InputFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
          {...props}
        />
      </div>
    </div>
  );
};