'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Bar, BarChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Emotion {
  sadness: number;
  joy: number;
  fear: number;
  disgust: number;
  anger: number;
}

interface Sentiment {
  score: number;
  label: string;
}

interface Keyword {
  text: string;
  sentiment: Sentiment;
  relevance: number;
  emotion: Emotion;
  count: number;
}

interface Usage {
  text_units: number;
  text_characters: number;
  features: number;
}

interface AnalysisResult {
  usage: Usage;
  language: string;
  keywords: Keyword[];
  entities: any[];
}

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleCheck = async () => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data: AnalysisResult = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Error:', err)
      setResult(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Emotional Tone Checker for Text</CardTitle>
          <CardDescription className="text-center">
            Enter your text below to analyze its emotional tone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your text here (up to 500 words)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-40"
            />
            <Button onClick={handleCheck} className="w-full">
              Analyze Emotional Tone
            </Button>
          </div>
        </CardContent>
      </Card>
      {result && result.keywords && result.keywords.map((keyword, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              Fragment analyzed: "{keyword.text}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[300px]">
                <h3 className="text-lg font-semibold mb-2 text-center">Emotions</h3>
                <ChartContainer
                  config={{
                    emotion: {
                      label: "Emotion Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(keyword.emotion).map(([name, value]) => ({ name, value }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-emotion)" radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="h-[300px]">
                <h3 className="text-lg font-semibold mb-2 text-center">Sentiment</h3>
                <ChartContainer
                  config={{
                    sentiment: {
                      label: "Sentiment Score",
                    },
                  }}
                  className="h-full"
                >
                  <RadialBarChart
                    data={[{ sentiment: Math.abs(keyword.sentiment.score) }]}
                    startAngle={0}
                    endAngle={360 * keyword.sentiment.score}
                    innerRadius={80}
                    outerRadius={110}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 1]}
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RadialBar
                      dataKey="sentiment"
                      background
                      cornerRadius={10}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-3xl font-bold"
                    >
                      {keyword.sentiment.score.toFixed(2)}
                    </text>
                    <text
                      x="50%"
                      y="56%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground text-sm"
                    >
                      {keyword.sentiment.label}
                    </text>
                  </RadialBarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}