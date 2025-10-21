import React from 'react'

const StateCard = ({title, value, icon: Icon, color, subtitle}) => {

    const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className=" md:p-4 p-3 border border-gray-400 text-card-foreground flex flex-col gap-6 rounded-xl ">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
                     <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <div className="ml-5 w-0 flex-1">
                <div>
                    <p className="truncate text-sm text-gray-500">{title}</p>
                    <h3 className="mt-1 text-gray-900">{value}</h3>
                    {
                        subtitle && (
                            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default StateCard