import { ComponentProps } from 'react';

interface SocialButtonProps extends ComponentProps<'button'> {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const SocialButton = ({ icon, children, ...props }: SocialButtonProps) => {
  return (
    <button
      className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};