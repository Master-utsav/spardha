'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSession } from 'next-auth/react';
import { Save, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { renderFormattedText } from '@/lib/parsedText';
import { cn } from '@/lib/utils';

function AddCodeClashQuestion({ details }: { details: any }) {
  const { data: session } = useSession();
  const params = useParams();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(-1);
  const [marks, setMarks] = useState(2);
  const [negativeMarks, setNegativeMarks] = useState(0.5);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleLanguageSelect = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess(false);

      if (selectedLanguage.length <= 0) {
        setError('Please select a language');
        return;
      }
      if (
        !question ||
        options.some((opt) => !opt) ||
        correctAnswer === undefined ||
        correctAnswer === -1
      ) {
        setError('Please fill in all fields');
        return;
      }

      await axios.post(`/api/add-question/code-clash/${details.quizId}`, {
        quizId: details.quizId,
        question,
        language: selectedLanguage,
        role: session?.user.role,
        isAdmin: session?.user.isAdmin,
        options,
        correctAnswer,
        marks,
        negativeMarks,
      });

      setSuccess(true);
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
    } catch (error) {
      setError('Failed to add question. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold capitalize text-navy-blue dark:text-baby-blue">
                Add Question to{' '}
                {(params['quizId'] as string).replace(/-/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-100 dark:bg-green-900">
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Question added successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <p className="mb-6 text-base text-gray-600 dark:text-gray-400">
                  Select your preferred programming language to begin the quiz.
                </p>
                <div className="mx-auto max-w-xs">
                  <Select onValueChange={handleLanguageSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {details &&
                        details.languages.map((lang: string) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Question</Label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter question (Use <codeBlock>text</codeBlock> for codeBlock, <bold>text</bold> for bold text, <br> or </br> for line break) and <code>text</code> for code"
                  className="h-32"
                />
                {question && (
                  <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                    <p className="text-gray-700 dark:text-gray-300">Preview:</p>
                    <div className="mt-2">
                      {renderFormattedText(question, selectedLanguage)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <>
                    <div key={index} className="flex gap-3">
                      <Textarea
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        className={cn(
                          correctAnswer === index
                            ? 'bg-blue-grotto text-white'
                            : '',
                          'hover:bg-blue-grotto hover:text-white active:scale-95'
                        )}
                        onClick={() => setCorrectAnswer(index)}
                      >
                        Correct
                      </Button>
                    </div>
                    <div
                      className="rounded-lg bg-white text-base dark:bg-navy-blue/50"
                      key={'preview' + index}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Preview:
                      </p>
                      {renderFormattedText(option, selectedLanguage)}
                    </div>
                    <div className="h-[1.6px] w-full bg-gradient-to-t from-transparent via-black to-transparent py-1"></div>
                  </>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4" key={'mark'}>
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    min={0}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label>Negative Marks</Label>
                  <Input
                    type="number"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-grotto hover:bg-navy-blue"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Question
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AddCodeClashQuestion;
