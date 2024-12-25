interface ContentSectionProps {
    title: string;
    description: string;
    userCount?: number;
  }
  
  export const ContentSection = ({ title, description, userCount }: ContentSectionProps) => {
    return (
      <div className="max-w-md text-white">
        <h2 className="text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg text-green-100 mb-8">{description}</p>
        {userCount && (
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://www.pexels.com/photo/woman-wearing-black-spaghetti-strap-top-415829/" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <p className="text-sm text-green-100">
              Join {userCount.toLocaleString()}+ users already on board
            </p>
          </div>
        )}
      </div>
    );
  };