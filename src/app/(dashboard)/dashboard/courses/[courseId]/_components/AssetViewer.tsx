'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizInterface } from '@/components/shared/QuizInterface';
import { MockTestPlayer } from '@/components/shared/MockTestPlayer';
import { markAssetComplete } from '../actions';
import { sanitizeHtml } from '@/components/admin/RichEditor';
import type { DemoQuestion } from '@/types';

type AssetType = 'VIDEO' | 'PDF' | 'ARTICLE' | 'QUIZ' | 'QUESTION_SET' | 'MOCK_TEST';

type QuestionData = {
  id: string;
  statement: string;
  difficulty: string;
  explanation: string | null;
  options: { id: string; content: string; isCorrect: boolean; sortOrder: number }[];
};

type QuizItem = { sortOrder: number; question: QuestionData };

export type AssetData = {
  id: string;
  title: string;
  description: string | null;
  assetType: AssetType;
  videoUrl: string | null;
  videoDuration: number | null;
  videoProvider: string | null;
  pdfUrl: string | null;
  articleContent: string | null;
  quiz: {
    id: string;
    title: string;
    timeLimit: number | null;
    passingScore: number;
    questions: QuizItem[];
  } | null;
  questionSet: {
    id: string;
    title: string;
    questions: QuizItem[];
  } | null;
  mockTest: { id: string; title: string } | null;
};

interface AssetViewerProps {
  asset: AssetData;
  enrollmentId: string | null;
  isCompleted: boolean;
  nextAssetId: string | null;
  courseId: string;
  color: string;
  /** Called after the asset is successfully marked complete */
  onComplete?: (assetId: string) => void;
  /** Called when user wants to navigate to a different asset */
  onNavigate?: (assetId: string) => void;
}

// ─── Adapters ──────────────────────────────────────────────────

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function adaptQuestions(items: QuizItem[]): DemoQuestion[] {
  return items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ question: q }) => {
      const sorted = [...q.options].sort((a, b) => a.sortOrder - b.sortOrder);
      // Map options to letter IDs so the circle shows "A", "B", "C", "D"
      const options = sorted.map((o, i) => ({
        id: LETTERS[i] ?? String(i),
        content: o.content,
      }));
      const correctIdx = sorted.findIndex(o => o.isCorrect);
      const correctAnswerId = correctIdx >= 0 ? (LETTERS[correctIdx] ?? String(correctIdx)) : '';
      return {
        id: q.id,
        subject: 'Course Quiz',
        topic: '',
        category: 'SAT_PREP' as const,
        difficulty: q.difficulty as DemoQuestion['difficulty'],
        question: q.statement,
        options,
        correctAnswerId,
        explanation: q.explanation ?? '',
        points: 1,
        tags: [],
      };
    });
}

// ─── Sub-renderers ─────────────────────────────────────────────

function VideoPlayer({ videoUrl, videoProvider }: { videoUrl: string; videoProvider: string | null }) {
  function getYTId(url: string) {
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const m = url.match(/(?:v=|\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : url;
  }
  function getVimeoId(url: string) {
    if (/^\d+$/.test(url)) return url;
    const m = url.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : url;
  }

  if (videoProvider === 'youtube') {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
        <iframe
          src={`https://www.youtube.com/embed/${getYTId(videoUrl)}?rel=0&modestbranding=1`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="Video lesson"
        />
      </div>
    );
  }
  if (videoProvider === 'vimeo') {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
        <iframe
          src={`https://player.vimeo.com/video/${getVimeoId(videoUrl)}?title=0&byline=0&portrait=0`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Video lesson"
        />
      </div>
    );
  }
  return (
    <video src={videoUrl} controls className="w-full rounded-xl shadow-md" style={{ background: '#000' }}>
      Your browser does not support the video element.
    </video>
  );
}

function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden border"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', minHeight: '80vh' }}
    >
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        style={{ minHeight: '80vh', height: 'calc(100vh - 160px)', border: 'none' }}
        title="PDF document"
      />
    </div>
  );
}

function ArticleViewer({ content }: { content: string }) {
  return (
    <div
      className="rounded-xl p-6 border rich-content prose max-w-none"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <div
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-foreground)' }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div
      className="flex items-center justify-center h-40 rounded-xl border"
      style={{ background: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
    >
      <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{message}</p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────

export function AssetViewer({
  asset,
  enrollmentId,
  isCompleted: initialCompleted,
  nextAssetId,
  courseId: _courseId,
  color,
  onComplete,
  onNavigate,
}: AssetViewerProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const complete = () => {
    if (!enrollmentId || completed) return;
    startTransition(async () => {
      const res = await markAssetComplete(enrollmentId, asset.id);
      if (res.ok) {
        setCompleted(true);
        onComplete?.(asset.id);
      }
    });
  };

  const goNext = () => {
    if (nextAssetId && onNavigate) onNavigate(nextAssetId);
  };

  const isAssessment = asset.assetType === 'QUIZ' || asset.assetType === 'QUESTION_SET';

  const content = (() => {
    switch (asset.assetType) {
      case 'VIDEO':
        return asset.videoUrl
          ? <VideoPlayer videoUrl={asset.videoUrl} videoProvider={asset.videoProvider} />
          : <Empty message="Video not available" />;

      case 'PDF':
        return asset.pdfUrl
          ? <PDFViewer pdfUrl={asset.pdfUrl} />
          : <Empty message="PDF not available" />;

      case 'ARTICLE':
        return asset.articleContent
          ? <ArticleViewer content={asset.articleContent} />
          : <Empty message="Article content not available" />;

      case 'QUIZ':
        if (!asset.quiz || asset.quiz.questions.length === 0)
          return <Empty message="Quiz not available" />;
        return (
          <QuizInterface
            questions={adaptQuestions(asset.quiz.questions)}
            title={asset.quiz.title}
            timeLimit={asset.quiz.timeLimit ? asset.quiz.timeLimit * 60 : undefined}
            passingScore={asset.quiz.passingScore}
            className="w-full max-w-none"
            onComplete={(score) => {
              const pct = asset.quiz!.questions.length > 0
                ? Math.round((score / asset.quiz!.questions.length) * 100)
                : 0;
              if (pct >= asset.quiz!.passingScore) complete();
            }}
          />
        );

      case 'QUESTION_SET':
        if (!asset.questionSet || asset.questionSet.questions.length === 0)
          return <Empty message="Question set not available" />;
        return (
          <QuizInterface
            questions={adaptQuestions(asset.questionSet.questions)}
            title={asset.questionSet.title}
            className="w-full max-w-none"
            onComplete={complete}
          />
        );

      case 'MOCK_TEST':
        return (
          <MockTestPlayer
            assetId={asset.id}
            enrollmentId={enrollmentId}
            color={color}
            onComplete={complete}
          />
        );
    }
  })();

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Heading row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-heading-3 leading-snug" style={{ color: 'var(--color-foreground)' }}>
            {asset.title}
          </h1>
          {asset.description && (
            <p className="text-body mt-1" style={{ color: 'var(--color-muted-foreground)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(asset.description) }} />
          )}
        </div>
        {completed && (
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
            style={{
              background: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
              color: 'var(--color-success)',
            }}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Completed
          </span>
        )}
      </div>

      {/* Content */}
      {content}

      {/* Footer actions */}
      {enrollmentId && (
        <div
          className="flex items-center gap-3 pt-4 border-t flex-wrap"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {!isAssessment && !completed && (
            <Button
              size="sm"
              onClick={complete}
              disabled={isPending}
              className="text-white"
              style={{ background: color }}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              {isPending ? 'Saving…' : 'Mark as Complete'}
            </Button>
          )}

          {nextAssetId && (completed || isAssessment) && onNavigate && (
            <Button
              size="sm"
              onClick={goNext}
              className={completed ? 'text-white' : ''}
              variant={completed ? 'default' : 'outline'}
              style={completed ? { background: color } : undefined}
            >
              Next Lesson
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
