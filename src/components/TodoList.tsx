
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';
import { Task, FilterType, SortType } from '@/types/todo';
import { loadTasks, saveTasks } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created');
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    
    toast({
      title: "Task added!",
      description: `"${taskData.text}" has been added to your list.`,
    });
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed!",
        description: `"${task.text}" ${task.completed ? 'is now active' : 'has been completed'}.`,
      });
    }
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.text}" has been removed from your list.`,
        variant: "destructive",
      });
    }
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(prev => prev.filter(task => !task.completed));
    
    if (completedCount > 0) {
      toast({
        title: "Completed tasks cleared",
        description: `${completedCount} completed task${completedCount > 1 ? 's' : ''} removed.`,
      });
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    switch (filter) {
      case 'active':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      default:
        filtered = tasks;
    }

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  };

  const filteredTasks = getFilteredTasks();
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
        <p className="text-gray-600">Stay organized and get things done!</p>
      </div>

      <TaskInput onAddTask={addTask} />

      <TaskFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        taskCounts={taskCounts}
      />

      {taskCounts.completed > 0 && (
        <div className="mb-4 text-center">
          <Button
            variant="outline"
            onClick={clearCompleted}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            Clear {taskCounts.completed} Completed Task{taskCounts.completed > 1 ? 's' : ''}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 border-gray-200">
            <p className="text-gray-500 text-lg">
              {filter === 'all' && tasks.length === 0 && "No tasks yet. Add one above to get started!"}
              {filter === 'active' && tasks.length > 0 && taskCounts.active === 0 && "All tasks completed! 🎉"}
              {filter === 'completed' && taskCounts.completed === 0 && "No completed tasks yet."}
              {filter === 'all' && tasks.length > 0 && filteredTasks.length === 0 && "No tasks match your current filter."}
            </p>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {taskCounts.active} active, {taskCounts.completed} completed • Total: {taskCounts.all} tasks
        </div>
      )}
    </div>
  );
};

export default TodoList;
