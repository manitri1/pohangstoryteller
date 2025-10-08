'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  MapPin,
  Star,
  ArrowRight,
  Play,
  QrCode,
  ImageIcon,
  Gift,
  Album,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  // 애니메이션 변수들
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  const features = [
    {
      icon: BookOpen,
      title: '스토리 탐험',
      description: '포항의 매력을 담은 스토리 기반 여행 코스를 탐험해보세요.',
      href: '/stories',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: QrCode,
      title: 'QR 스탬프',
      description: 'QR 스탬프 투어로 여행의 추억을 디지털로 남겨보세요.',
      href: '/stamps',
      color: 'bg-secondary-50 text-secondary-600',
    },
    {
      icon: Users,
      title: '커뮤니티',
      description: '다른 여행자들과 경험을 공유하고 소통해보세요.',
      href: '/community',
      color: 'bg-accent-50 text-accent-600',
    },
    {
      icon: Album,
      title: '나의 앨범',
      description: '수집한 스탬프와 사진으로 앨범을 만들어보세요.',
      href: '/albums',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: ImageIcon,
      title: '미디어 관리',
      description: '여행 사진과 영상을 체계적으로 관리해보세요.',
      href: '/media',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Gift,
      title: '기념품 제작',
      description: '나만의 특별한 기념품을 직접 제작해보세요.',
      href: '/souvenirs',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const popularCourses = [
    {
      id: 1,
      title: '포항 바다 이야기',
      description:
        '영일대 해수욕장부터 포항운하까지, 포항의 바다를 만끽하는 코스',
      duration: '3시간',
      difficulty: '쉬움',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?random=1',
      category: '자연경관',
    },
    {
      id: 2,
      title: '포항 역사 탐방',
      description: '포항의 역사와 문화를 만나볼 수 있는 의미있는 여행',
      duration: '4시간',
      difficulty: '보통',
      rating: 4.6,
      image: 'https://picsum.photos/400/300?random=2',
      category: '역사여행',
    },
    {
      id: 3,
      title: '포항 맛집 투어',
      description: '포항의 대표 맛집들을 돌아보는 미식 여행',
      duration: '2시간',
      difficulty: '쉬움',
      rating: 4.9,
      image: 'https://picsum.photos/400/300?random=3',
      category: '맛집탐방',
    },
  ];

  return (
    <MainLayout showSidebar={false}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 sm:py-16 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div className="space-y-6 lg:space-y-8" {...fadeInLeft}>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Badge variant="secondary" className="w-fit">
                    포항의 새로운 여행 경험
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-display-lg xl:text-display-xl font-bold text-neutral-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  포항 스토리 텔러와 함께하는
                  <motion.span
                    className="text-primary block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    특별한 여행
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg lg:text-body-lg text-neutral-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  포항의 매력을 담은 스토리 기반 여행 경험을 제공하는
                  플랫폼입니다. AI가 추천하는 맞춤형 코스부터 QR 스탬프
                  투어까지, 새로운 방식의 여행을 시작해보세요.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="btn-primary w-full sm:w-auto">
                    스토리 탐험 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="btn-secondary w-full sm:w-auto"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    소개 영상 보기
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-first lg:order-last"
              {...fadeInRight}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="https://picsum.photos/600/400?random=hero"
                  alt="포항 스토리 텔러"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl shadow-lg p-3 lg:p-4"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary border-2 border-white"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                      />
                    ))}
                  </div>
                  <motion.div
                    className="text-xs lg:text-sm"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <div className="font-semibold text-neutral-900">
                      1,234명
                    </div>
                    <div className="text-neutral-500">이미 참여했어요!</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-4 mb-12 lg:mb-16"
            {...fadeInUp}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-display-md font-bold text-neutral-900"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              포항 스토리 텔러의 특별한 기능
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-body-lg text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              단순한 관광 정보가 아닌, 스토리와 경험을 기반으로 한 새로운 여행
              방식을 경험해보세요.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={feature.href}>
                    <Card className="card-story cursor-pointer overflow-hidden">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardHeader className="text-center">
                          <motion.div
                            className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="h-8 w-8" />
                          </motion.div>
                          <CardTitle className="text-h4">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-center">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </motion.div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-4 mb-12 lg:mb-16"
            {...fadeInUp}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-display-md font-bold text-neutral-900"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              인기 스토리 코스
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-body-lg text-neutral-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              포항의 매력을 가장 잘 담은 추천 코스들을 만나보세요.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {popularCourses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="card-course group overflow-hidden">
                  <motion.div
                    className="relative overflow-hidden rounded-t-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <motion.div
                      className="absolute top-4 left-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-neutral-700"
                      >
                        {course.category}
                      </Badge>
                    </motion.div>
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                        <Star className="h-4 w-4 text-secondary-500 fill-current" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                  <CardHeader>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      <CardTitle className="text-h5">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="flex items-center justify-between text-sm text-neutral-500"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className="px-2 py-1 bg-neutral-100 rounded-full">
                          {course.difficulty}
                        </span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="ghost" size="sm">
                          자세히 보기
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline">
                모든 코스 보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-6 lg:space-y-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-display-md font-bold text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              지금 바로 포항 스토리 텔러를 시작해보세요
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-body-lg text-primary-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AI가 추천하는 맞춤형 여행 코스부터 QR 스탬프 투어까지, 포항의
              새로운 여행 경험을 만나보세요.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-neutral-50 w-full sm:w-auto"
                >
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  더 알아보기
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
