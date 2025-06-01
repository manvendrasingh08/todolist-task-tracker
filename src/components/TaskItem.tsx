
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { Task } from '@/types/todo';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask }) => {
  const priorityColors = {
    low: 'border-l-green-500 bg-green-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    high: 'border-l-red-500 bg-red-50'
  };

  const priorityBadgeColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <Card className={`p-4 border-l-4 transition-all duration-300 hover:shadow-md ${priorityColors[task.priority]} ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        
        <div className="flex-1 min-w-0">
          <p className={`text-gray-800 transition-all duration-200 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.text}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadgeColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              {task.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
