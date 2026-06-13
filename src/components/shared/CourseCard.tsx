import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, BookOpen, BarChart2 } from 'lucide-react';
import { cn, formatPrice, formatDuration, getCategoryBadgeClass, getCategoryLabel, getDifficultyLabel } from '@/lib/utils';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function CourseCard({ course, className, variant = 'default' }: CourseCardProps) {
  const badgeClass = getCategoryBadgeClass(course.category);
  const categoryLabel = getCategoryLabel(course.category);

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/courses/${course.slug}`}
        className={cn('card-base flex gap-4 p-4 group', className)}
      >
        <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-[var(--color-muted)]">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded text-xs font-medium mb-1',
              badgeClass
            )}
          >
            {categoryLabel}
          </span>
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-foreground)' }}>
            {course.title}
          </h3>
          <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(course.price)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/courses/${course.slug}`}
        className={cn('card-base p-4 group block', className)}
      >
        <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium mb-2', badgeClass)}>
          {categoryLabel}
        </span>
        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors mb-2" style={{ color: 'var(--color-foreground)' }}>
          {course.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(course.price)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium difficulty-easy" style={{}}>
            {getDifficultyLabel(course.difficulty)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn('card-base overflow-hidden group block', className)}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-[var(--color-muted)]">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <BookOpen className="h-12 w-12 text-white opacity-80" />
          </div>
        )}
        {course.isFree && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white" style={{ background: 'var(--color-success)' }}>
            FREE
          </span>
        )}
        <span
          className={cn(
            'absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium',
            badgeClass
          )}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--color-muted)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            {getDifficultyLabel(course.difficulty)}
          </span>
        </div>

        <h3
          className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors"
          style={{ color: 'var(--color-foreground)' }}
        >
          {course.title}
        </h3>

        {course.shortDesc && (
          <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
            {course.shortDesc}
          </p>
        )}

        <div
          className="flex items-center gap-4 text-xs mb-4"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          {course.durationHours && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(course.durationHours)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons} lessons
          </span>
          {course.enrollments && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.enrollments.length.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating & Price */}
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-1">
            {course.reviews && course.reviews.length > 0 && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {(course.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / course.reviews.length).toFixed(1)}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  ({course.reviews.length})
                </span>
              </>
            )}
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
