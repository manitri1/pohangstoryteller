import { NextResponse } from 'next/server';
import mockCourses from '@/data/mock-courses.json';

export async function GET() {
  try {
    return NextResponse.json(mockCourses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
