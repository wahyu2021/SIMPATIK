import React from 'react';

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20 hover:border-white hover:border-opacity-40 transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg shrink-0">
                    <Icon className="w-6 h-6 text-gray-800" />
                </div>
                <div>
                    <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}
