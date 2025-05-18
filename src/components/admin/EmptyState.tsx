
import React from 'react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
