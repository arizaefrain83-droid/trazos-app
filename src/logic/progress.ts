import { INTRO, PATHS } from "../data/courses";
import { Course, Lesson, LessonProgress } from "../data/types";

type ProgressMap = Record<string, LessonProgress>;

export const isDone = (p: ProgressMap, lessonId: string) => p[lessonId]?.completed === true;

export const isIntroDone = (p: ProgressMap) => INTRO.lessons.every((l) => isDone(p, l.id));

export const isCourseUnlocked = (course: Course, p: ProgressMap) => course.kind === "intro" || isIntroDone(p);

export function isLessonUnlocked(course: Course, index: number, p: ProgressMap): boolean {
  if (!isCourseUnlocked(course, p)) return false;
  return index === 0 || isDone(p, course.lessons[index - 1].id);
}

export function orderedPaths(interests: string[]): Course[] {
  const picked = PATHS.filter((c) => interests.includes(c.id));
  const rest = PATHS.filter((c) => !interests.includes(c.id));
  return [...picked, ...rest];
}

export function nextLesson(p: ProgressMap, interests: string[]): { course: Course; lesson: Lesson } | undefined {
  for (const course of [INTRO, ...orderedPaths(interests)]) {
    const idx = course.lessons.findIndex((l, i) => !isDone(p, l.id) && isLessonUnlocked(course, i, p));
    if (idx >= 0) return { course, lesson: course.lessons[idx] };
  }
  return undefined;
}

export const courseDoneCount = (course: Course, p: ProgressMap) => course.lessons.filter((l) => isDone(p, l.id)).length;

export const totalStars = (p: ProgressMap) => Object.values(p).reduce((acc, x) => acc + x.stars, 0);
