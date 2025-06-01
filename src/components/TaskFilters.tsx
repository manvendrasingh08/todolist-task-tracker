// filters functionality
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterType, SortType } from '@/types/todo';

interface TaskFiltersProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  taskCounts
}) => {
  const filterButtons: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <Card className="p-4 mb-6 bg-white border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.key}
              variant={filter === btn.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(btn.key)}
              className={`transition-all duration-200 ${
                filter === btn.key 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {btn.label} ({btn.count})
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <Select value={sort} onValueChange={(value: SortType) => onSortChange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default TaskFilters;
