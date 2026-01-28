import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GenerateLessonDto {
  topic: string;
  gradeLevel?: string;
  learningObjectives?: string[];
  duration?: number;
  type?: 'TEXT' | 'VIDEO' | 'QUIZ' | 'INTERACTIVE';
}

interface GeneratedLesson {
  title: string;
  content: string;
  objectives: string[];
  activities: string[];
  assessmentIdeas: string[];
}

@Injectable()
export class LessonGeneratorService {
  private readonly logger = new Logger(LessonGeneratorService.name);
  private readonly apiKey: string;
  private readonly model = 'gemini-1.5-flash';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  async generateLesson(dto: GenerateLessonDto): Promise<GeneratedLesson> {
    const { topic, gradeLevel, learningObjectives, duration = 30, type = 'TEXT' } = dto;

    // Build the prompt
    const prompt = this.buildPrompt(topic, gradeLevel, learningObjectives, duration, type);

    try {
      // If no API key, return mock data
      if (!this.apiKey) {
        this.logger.warn('No GEMINI_API_KEY configured, returning mock lesson');
        return this.getMockLesson(topic, gradeLevel, duration);
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No content generated');
      }

      return this.parseGeneratedContent(text, topic);
    } catch (error) {
      this.logger.error('Failed to generate lesson with AI:', error);
      // Fallback to mock data
      return this.getMockLesson(topic, gradeLevel, duration);
    }
  }

  private buildPrompt(
    topic: string,
    gradeLevel?: string,
    learningObjectives?: string[],
    duration?: number,
    type?: string,
  ): string {
    let prompt = `Create an educational lesson about "${topic}".\n\n`;

    if (gradeLevel) {
      prompt += `Target audience: Grade ${gradeLevel} students.\n`;
    }

    if (learningObjectives && learningObjectives.length > 0) {
      prompt += `Learning objectives:\n${learningObjectives.map((o) => `- ${o}`).join('\n')}\n\n`;
    }

    if (duration) {
      prompt += `Lesson duration: approximately ${duration} minutes.\n`;
    }

    if (type) {
      prompt += `Lesson format: ${type.toLowerCase()} lesson.\n\n`;
    }

    prompt += `Please provide the lesson in the following JSON format:
{
  "title": "A clear, engaging title for the lesson",
  "content": "The main lesson content with clear explanations, examples, and key concepts. Use markdown formatting.",
  "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"],
  "activities": ["Activity 1 description", "Activity 2 description"],
  "assessmentIdeas": ["Assessment idea 1", "Assessment idea 2"]
}

Guidelines:
- Use trauma-informed, healing-centered language
- Make content accessible and engaging
- Include real-world connections
- Support diverse learning styles
- Be encouraging and non-punitive`;

    return prompt;
  }

  private parseGeneratedContent(text: string, topic: string): GeneratedLesson {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || `Introduction to ${topic}`,
          content: parsed.content || text,
          objectives: parsed.objectives || [],
          activities: parsed.activities || [],
          assessmentIdeas: parsed.assessmentIdeas || [],
        };
      }
    } catch {
      this.logger.warn('Failed to parse JSON, using text as content');
    }

    // Fallback: use raw text as content
    return {
      title: `Introduction to ${topic}`,
      content: text,
      objectives: [],
      activities: [],
      assessmentIdeas: [],
    };
  }

  private getMockLesson(topic: string, gradeLevel?: string, duration?: number): GeneratedLesson {
    const grade = gradeLevel || 'middle school';
    const time = duration || 30;

    return {
      title: `Understanding ${topic}`,
      content: `# Introduction to ${topic}

Welcome to this lesson on **${topic}**! Let's explore this fascinating subject together.

## What You'll Learn

In this ${time}-minute lesson designed for ${grade} students, we'll discover the key concepts and ideas behind ${topic}.

## Key Concepts

### 1. Getting Started
Let's begin by understanding the basics. ${topic} is an important subject that connects to many areas of our lives.

### 2. Core Ideas
- **Foundation**: Understanding the basic principles
- **Application**: How these ideas work in practice
- **Connection**: Relating to things you already know

### 3. Real-World Examples
Think about how ${topic} appears in your daily life. Can you spot any examples?

## Summary

Today we learned about the fundamentals of ${topic}. Remember:
1. Every journey starts with curiosity
2. It's okay to ask questions
3. Learning is a process, not a destination

## Reflection
Take a moment to think about what you found most interesting about ${topic}.`,
      objectives: [
        `Understand the basic concepts of ${topic}`,
        `Identify real-world applications of ${topic}`,
        `Connect ${topic} to prior knowledge`,
        `Develop curiosity and questions about ${topic}`,
      ],
      activities: [
        `Think-Pair-Share: Discuss what you already know about ${topic} with a partner`,
        `Quick Write: Spend 3 minutes writing everything that comes to mind about ${topic}`,
        `Gallery Walk: View examples of ${topic} around the classroom`,
        `Exit Ticket: Write one thing you learned and one question you still have`,
      ],
      assessmentIdeas: [
        `Create a concept map showing connections between ideas`,
        `Write a short reflection on what ${topic} means to you`,
        `Design a poster explaining ${topic} to someone younger`,
        `Participate in a class discussion sharing insights`,
      ],
    };
  }
}
