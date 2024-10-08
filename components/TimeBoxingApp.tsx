"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Clock, Zap, Plus, X, Edit2, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// タスクの型定義
interface Task {
  id: number;
  name: string;
  duration: number;
  completed: boolean;
  column: '予定' | '詳細' | 'TODO';
  details?: string;
  time?: string;
  isEditing?: boolean;
}

const TimeBoxingApp: React.FC = () => {
  // 状態の定義
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(25);
  const [newTaskColumn, setNewTaskColumn] = useState<'予定' | '詳細' | 'TODO'>('予定');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const { toast } = useToast();

  // 新しいタスクを追加する関数
  const addTask = () => {
    if (newTaskName.trim() !== '') {
      setTasks([...tasks, {
        id: Date.now(),
        name: newTaskName,
        duration: newTaskDuration,
        completed: false,
        column: newTaskColumn,
        details: newTaskDetails,
        time: newTaskTime,
        isEditing: false
      }]);
      setNewTaskName('');
      setNewTaskDuration(25);
      setNewTaskDetails('');
      setNewTaskTime('');
    }
  };

  // タスクを削除する関数
  const removeTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // タスクの編集モードを切り替える関数
  const toggleEditTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    ));
  };

  // タスク名を更新する関数
  const updateTaskName = (taskId: number, newName: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, name: newName, isEditing: false } : task
    ));
  };

  // AIアシスト機能を処理する関数
  const handleAIAssist = async () => {
    toast({
      title: "AIアシスタント",
      description: "タスクを分析し、スケジュールを最適化しています...",
    });
    
    setTimeout(() => {
      const aiSuggestedTask = {
        id: Date.now(),
        name: "AI提案: 短い休憩を取る",
        duration: 5,
        completed: false,
        column: 'TODO' as const,
        time: '15:00',
        isEditing: false
      };
      setTasks([...tasks, aiSuggestedTask]);
      toast({
        title: "AI提案が追加されました",
        description: "生産性を最適化するために短い休憩が追加されました。",
      });
    }, 2000);
  };

  // 個々のタスクをレンダリングする関数
  const renderTask = (task: Task) => (
    <div key={task.id} className="flex justify-between items-center p-2 border-b">
      {task.isEditing ? (
        <Input
          value={task.name}
          onChange={(e) => updateTaskName(task.id, e.target.value)}
          onBlur={() => toggleEditTask(task.id)}
          autoFocus
        />
      ) : (
        <span>{task.time ? `${task.time} - ` : ''}{task.name} ({task.duration}分)</span>
      )}
      <div>
        <Button variant="ghost" size="sm" onClick={() => toggleEditTask(task.id)}>
          {task.isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}><X className="h-4 w-4" /></Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 新しいタスク追加フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>新しいタスクを追加</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">タスク名</Label>
            <Input
              id="task-name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="タスク名を入力"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-duration">所要時間 (分): {newTaskDuration}</Label>
            <Slider
              id="task-duration"
              min={5}
              max={120}
              step={5}
              value={[newTaskDuration]}
              onValueChange={(value) => setNewTaskDuration(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-column">カテゴリ</Label>
            <Select onValueChange={(value: '予定' | '詳細' | 'TODO') => setNewTaskColumn(value)}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="予定">予定</SelectItem>
                <SelectItem value="詳細">詳細</SelectItem>
                <SelectItem value="TODO">TODO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newTaskColumn === '詳細' && (
            <div className="space-y-2">
              <Label htmlFor="task-details">詳細</Label>
              <Textarea
                id="task-details"
                value={newTaskDetails}
                onChange={(e) => setNewTaskDetails(e.target.value)}
                placeholder="タスクの詳細を入力"
              />
            </div>
          )}
          {newTaskColumn === '予定' && (
            <div className="space-y-2">
              <Label htmlFor="task-time">時間</Label>
              <Input
                id="task-time"
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
              />
            </div>
          )}
          <Button onClick={addTask}><Plus className="mr-2 h-4 w-4" /> タスクを追加</Button>
        </CardContent>
      </Card>

      {/* タスク一覧表示エリア */}
      <div className="grid grid-cols-3 gap-4">
        {/* 予定されたタスク */}
        <Card>
          <CardHeader>
            <CardTitle>予定されたタスク</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks
              .filter(task => task.column === '予定')
              .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
              .map(renderTask)}
          </CardContent>
        </Card>

        {/* 詳細なタスク */}
        <Card>
          <CardHeader>
            <CardTitle>詳細なタスク</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks
              .filter(task => task.column === '詳細')
              .map(task => (
                <div key={task.id} className="p-2 border-b">
                  {renderTask(task)}
                  <p className="text-sm text-gray-600 mt-1">{task.details}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* TODOリスト */}
        <Card>
          <CardHeader>
            <CardTitle>TODOリスト</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks
              .filter(task => task.column === 'TODO')
              .map(renderTask)}
          </CardContent>
        </Card>
      </div>

      {/* AIアシスタント機能 */}
      <Card>
        <CardHeader>
          <CardTitle>AIアシスタント</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAIAssist}>
            <Zap className="mr-2 h-4 w-4" /> AI提案を取得
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBoxingApp;