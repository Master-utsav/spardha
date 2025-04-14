'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import MultipleSelector, { Option } from '@/components/ui/multiselect';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const programmingLanguages: Option[] = [
  'C',
  'Cpp',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'PHP',
  'Ruby',
  'Perl',
  'HTML',
  'CSS',
  'React',
  'Vue',
  'Angular',
  'Svelte',
].map((lang) => ({ value: lang.toLowerCase(), label: lang }));

export default function AdminAddQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quizName, setQuizName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<Option[]>([]);
  const [selectedtDifficulty, setSelectedDifficulty] =
    useState<string>('beginner');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<string[]>(['']);
  const [prizeMoney, setPrizeMoney] = useState([0, 0, 0]);
  const [entryFee, setEntryFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState('');

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index] = value;
    setRules(updatedRules);
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules.length ? updatedRules : ['']);
  };

  const selectedEvent = params['competition'];

  const handleSubmitQuizInfo = async () => {
    if (!quizName || !selectedLanguages.length || !description || !rules[0]) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill all required fields!',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        quizName,
        languages: selectedLanguages.map((lang) => lang.value),
        difficulty: selectedtDifficulty,
        description,
        rules,
        prizeMoney,
        entryFee,
      };

      const response = await axios.post(
        `/api/add-quiz/${selectedEvent}`,
        payload
      );

      toast({
        variant: 'default',
        title: 'Success',
        description: response.data.message || 'Quiz created successfully!',
      });

      // Reset form
      setQuizId(response.data.quizId);
      setQuizName('');
      setSelectedLanguages([]);
      setSelectedDifficulty('');
      setDescription('');
      setRules(['']);
      setPrizeMoney([0, 0, 0]);
      setEntryFee(0);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: error.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setLoading(false);
      router.push(`/admin/add-question/${selectedEvent}/${quizId}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
      <h2 className="text-center text-2xl font-bold capitalize text-gray-900 dark:text-white">
        Add Quiz in {(selectedEvent as string).replace('-', ' ')}
      </h2>

      {/* Quiz Name */}
      <div>
        <Label htmlFor="quizName">Quiz Name</Label>
        <Input
          id="quizName"
          placeholder="Enter quiz name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
      </div>

      {/* Languages */}
      <div>
        <Label>Languages</Label>
        <MultipleSelector
          commandProps={{ label: 'Select programming languages' }}
          value={selectedLanguages}
          defaultOptions={programmingLanguages}
          onChange={setSelectedLanguages}
          placeholder="Select languages"
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Enter quiz description"
          className="min-h-[100px] resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="rounded-lg border bg-gray-100 p-4 shadow-md dark:bg-gray-800">
        <Label>Select Event for Quiz</Label>
        <Select
          value={selectedtDifficulty}
          onValueChange={setSelectedDifficulty}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {[
              'beginner',
              'easy',
              'moderate',
              'hard',
              'legendary',
              'critical',
            ].map((event) => (
              <SelectItem key={event} value={event}>
                {event}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rules Section */}
      <div>
        <Label>Rules</Label>
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                placeholder={`Rule ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveRule(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full"
          onClick={() => setRules([...rules, ''])}
        >
          + Add Rule
        </Button>
      </div>

      {/* Entry Fee */}
      <div>
        <Label htmlFor="entryFee">Entry Fee</Label>
        <Input
          id="entryFee"
          type="number"
          placeholder="Enter entry fee"
          value={entryFee}
          onChange={(e) => setEntryFee(Number(e.target.value))}
        />
      </div>

      {/* Prize Money */}
      <div>
        <Label>Prize Money</Label>
        <div className="grid grid-cols-3 gap-4">
          {['1st', '2nd', '3rd'].map((place, index) => (
            <div key={index}>
              <Label htmlFor={`prize-${index}`}>{place} Place</Label>
              <Input
                id={`prize-${index}`}
                type="number"
                value={prizeMoney[index]}
                onChange={(e) => {
                  const updatedPrizes = [...prizeMoney];
                  updatedPrizes[index] = Number(e.target.value);
                  setPrizeMoney(updatedPrizes);
                }}
                placeholder={`₹ Prize for ${place}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="mt-4 w-full text-white"
        onClick={handleSubmitQuizInfo}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Quiz'}
      </Button>
    </div>
  );
}
