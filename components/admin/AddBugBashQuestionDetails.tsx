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
import { TabsContent } from '@radix-ui/react-tabs';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

function AddBugBashQuestionDetails({ details }: { details: any }) {
  const { data: session } = useSession();
  const params = useParams();
  const [questionProblem, setQuestionProblem] = useState('');
  const [questionBuggySolution, setQuestionBuggySolution] = useState('');
  const [correctSolution, setCorrectSolution] = useState('');
  const [marks, setMarks] = useState(2);
  const [negativeMarks, setNegativeMarks] = useState(0.5);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

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
      if (questionBuggySolution.length <= 0) {
        setError('Problem statement is missing');
        return;
      }

      await axios.post(`/api/add-question/bug-bash/${details.quizId}`, {
        quizId: details.quizId,
        question: {
          problem: questionProblem,
          buggySolution: questionBuggySolution,
        },
        language: selectedLanguage,
        role: session?.user.role,
        isAdmin: session?.user.isAdmin,
        correctSolution,
        marks,
        negativeMarks,
      });

      setSuccess(true);
      setQuestionProblem('');
      setQuestionBuggySolution('');
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
                <Tabs defaultValue="problem" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="problem">Problem Statement</TabsTrigger>
                    <TabsTrigger value="buggy-solution">
                      Buggy Solution
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="problem">
                    <Textarea
                      value={questionProblem}
                      onChange={(e) => setQuestionProblem(e.target.value)}
                      placeholder="Enter question (Use <codeBlock>text</codeBlock> for codeBlock, <bold>text</bold> for bold text, <br> or </br> for line break) and <code>text</code> for code"
                      className="h-32"
                    />
                    {questionProblem && (
                      <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                        <p className="text-gray-700 dark:text-gray-300">
                          Preview:
                        </p>
                        <div className="mt-2">
                          {renderFormattedText(
                            questionProblem,
                            selectedLanguage
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="buggy-solution">
                    <Textarea
                      value={questionBuggySolution}
                      onChange={(e) => setQuestionBuggySolution(e.target.value)}
                      placeholder="Enter solution in a <codeBlock>text</codeBlock> for codeBlock"
                      className="h-32"
                    />
                    {questionBuggySolution && (
                      <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                        <p className="text-gray-700 dark:text-gray-300">
                          Preview:
                        </p>
                        <div className="mt-2">
                          {renderFormattedText(
                            questionBuggySolution,
                            selectedLanguage
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              <div className="mt-2 rounded-lg bg-white dark:bg-navy-blue/50">
                <Label>Correct Solution of the problem : </Label>
                <Textarea
                  value={correctSolution}
                  onChange={(e) => setCorrectSolution(e.target.value)}
                  placeholder="Enter solution in a <codeBlock>text</codeBlock> for codeBlock"
                  className="h-32"
                />
                {correctSolution && (
                  <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                    <p className="text-gray-700 dark:text-gray-300">Preview:</p>
                    <div className="mt-2">
                      {renderFormattedText(correctSolution, selectedLanguage)}
                    </div>
                  </div>
                )}
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

export default AddBugBashQuestionDetails;
