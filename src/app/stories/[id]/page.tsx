import { notFound } from 'next/navigation';
import { CourseDetail } from '@/components/stories/course-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourse(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch course:', response.status, response.statusText);
      return null;
    }

    const course = await response.json();
    return course;
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
}