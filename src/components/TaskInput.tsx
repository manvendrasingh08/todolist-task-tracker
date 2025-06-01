
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Task } from '@/types/todo';

interface TaskInputProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  const validateTask = (text: string): boolean => {
    if (!text.trim()) {
      setError('Task cannot be empty');
      return false;
    }
    if (text.trim().length < 3) {
      setError('Task must be at least 3 characters long');
      return false;
    }
    if (text.trim().length > 100) {
      setError('Task must be less than 100 characters');
      return false;
    }
    setError('');
    return true;
  };
// function handling functionality
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTask(taskText)) return;

    onAddTask({
      text: taskText.trim(),
      completed: false,
      priority
    });

    setTaskText('');
    setPriority('medium');
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={taskText}
              onChange={(e) => {
                setTaskText(e.target.value);
                if (error) validateTask(e.target.value);
              }}
              className={`transition-all duration-200 ${error ? 'border-red-500 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 animate-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}
          </div>
          
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger className="w-32 border-blue-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            type="submit" 
            className="px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskInput;
