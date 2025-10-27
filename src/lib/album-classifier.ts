/**
 * 앨범 자동 분류 알고리즘
 * 스탬프, 사진, 영상 등의 콘텐츠를 분석하여 자동으로 앨범을 생성하고 분류
 */

export interface AlbumItem {
  id: string;
  type: 'stamp' | 'photo' | 'video' | 'text';
  title: string;
  contentUrl: string;
  metadata: {
    location?: string;
    timestamp?: Date;
    tags?: string[];
    coordinates?: { lat: number; lng: number };
    duration?: number;
    fileSize?: number;
  };
}

export interface Album {
  id: string;
  title: string;
  description: string;
  theme: 'nature' | 'history' | 'food' | 'culture' | 'general';
  items: AlbumItem[];
  generatedAt: Date;
  classificationReason: string;
}

export class AlbumClassifier {
  /**
   * 날짜별로 앨범 분류
   */
  classifyByDate(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const dateGroups = new Map<string, AlbumItem[]>();

    // 날짜별로 그룹화
    items.forEach((item) => {
      if (item.metadata.timestamp) {
        const date = new Date(item.metadata.timestamp);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!dateGroups.has(dateKey)) {
          dateGroups.set(dateKey, []);
        }
        dateGroups.get(dateKey)!.push(item);
      }
    });

    // 각 날짜별로 앨범 생성
    dateGroups.forEach((items, dateKey) => {
      const date = new Date(dateKey);
      const album: Album = {
        id: `date-${dateKey}`,
        title: `포항 여행 기록 - ${this.formatDate(date)}`,
        description: `${date.toLocaleDateString(
          'ko-KR'
        )}에 포항에서의 소중한 순간들을 담은 앨범입니다.`,
        theme: this.determineThemeByTime(date),
        items: items.sort(
          (a, b) =>
            new Date(a.metadata.timestamp || 0).getTime() -
            new Date(b.metadata.timestamp || 0).getTime()
        ),
        generatedAt: new Date(),
        classificationReason: `날짜별 자동 분류 (${dateKey})`,
      };
      albums.push(album);
    });

    return albums;
  }

  /**
   * 위치별로 앨범 분류
   */
  classifyByLocation(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const locationGroups = new Map<string, AlbumItem[]>();

    // 위치별로 그룹화
    items.forEach((item) => {
      const location = item.metadata.location || '알 수 없는 위치';

      if (!locationGroups.has(location)) {
        locationGroups.set(location, []);
      }
      locationGroups.get(location)!.push(item);
    });

    // 각 위치별로 앨범 생성
    locationGroups.forEach((items, location) => {
      const album: Album = {
        id: `location-${this.sanitizeId(location)}`,
        title: `${location}에서의 추억`,
        description: `${location}에서 촬영하거나 방문한 소중한 순간들을 담은 앨범입니다.`,
        theme: this.determineThemeByLocation(location),
        items: items,
        generatedAt: new Date(),
        classificationReason: `위치별 자동 분류 (${location})`,
      };
      albums.push(album);
    });

    return albums;
  }

  /**
   * 테마별로 앨범 분류
   */
  classifyByTheme(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const themeGroups = new Map<string, AlbumItem[]>();

    // 각 아이템의 테마 결정
    items.forEach((item) => {
      const theme = this.determineItemTheme(item);

      if (!themeGroups.has(theme)) {
        themeGroups.set(theme, []);
      }
      themeGroups.get(theme)!.push(item);
    });

    // 각 테마별로 앨범 생성
    themeGroups.forEach((items, theme) => {
      const album: Album = {
        id: `theme-${theme}`,
        title: this.getThemeTitle(theme),
        description: this.getThemeDescription(theme),
        theme: theme as any,
        items: items,
        generatedAt: new Date(),
        classificationReason: `테마별 자동 분류 (${theme})`,
      };
      albums.push(album);
    });

    return albums;
  }

  /**
   * 스마트 앨범 생성 (AI 기반)
   */
  generateSmartAlbums(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];

    // 1. 시간대별 분류 (아침, 오후, 저녁)
    const timeBasedAlbums = this.classifyByTimeOfDay(items);
    albums.push(...timeBasedAlbums);

    // 2. 활동별 분류 (산책, 식사, 관광 등)
    const activityBasedAlbums = this.classifyByActivity(items);
    albums.push(...activityBasedAlbums);

    // 3. 감정별 분류 (기쁨, 평온, 흥미 등)
    const emotionBasedAlbums = this.classifyByEmotion(items);
    albums.push(...emotionBasedAlbums);

    return albums;
  }

  /**
   * 시간대별 분류
   */
  private classifyByTimeOfDay(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const timeGroups = {
      morning: [] as AlbumItem[],
      afternoon: [] as AlbumItem[],
      evening: [] as AlbumItem[],
      night: [] as AlbumItem[],
    };

    items.forEach((item) => {
      if (item.metadata.timestamp) {
        const hour = new Date(item.metadata.timestamp).getHours();
        if (hour >= 6 && hour < 12) {
          timeGroups.morning.push(item);
        } else if (hour >= 12 && hour < 18) {
          timeGroups.afternoon.push(item);
        } else if (hour >= 18 && hour < 22) {
          timeGroups.evening.push(item);
        } else {
          timeGroups.night.push(item);
        }
      }
    });

    Object.entries(timeGroups).forEach(([timeOfDay, items]) => {
      if (items.length > 0) {
        albums.push({
          id: `time-${timeOfDay}`,
          title: this.getTimeOfDayTitle(timeOfDay),
          description: this.getTimeOfDayDescription(timeOfDay),
          theme: 'general',
          items: items,
          generatedAt: new Date(),
          classificationReason: `시간대별 분류 (${timeOfDay})`,
        });
      }
    });

    return albums;
  }

  /**
   * 활동별 분류
   */
  private classifyByActivity(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const activityGroups = new Map<string, AlbumItem[]>();

    items.forEach((item) => {
      const activity = this.determineActivity(item);

      if (!activityGroups.has(activity)) {
        activityGroups.set(activity, []);
      }
      activityGroups.get(activity)!.push(item);
    });

    activityGroups.forEach((items, activity) => {
      if (items.length > 0) {
        albums.push({
          id: `activity-${this.sanitizeId(activity)}`,
          title: `${activity}의 순간들`,
          description: `${activity} 활동과 관련된 소중한 순간들을 담은 앨범입니다.`,
          theme: this.determineThemeByActivity(activity),
          items: items,
          generatedAt: new Date(),
          classificationReason: `활동별 분류 (${activity})`,
        });
      }
    });

    return albums;
  }

  /**
   * 감정별 분류
   */
  private classifyByEmotion(items: AlbumItem[]): Album[] {
    const albums: Album[] = [];
    const emotionGroups = new Map<string, AlbumItem[]>();

    items.forEach((item) => {
      const emotion = this.determineEmotion(item);

      if (!emotionGroups.has(emotion)) {
        emotionGroups.set(emotion, []);
      }
      emotionGroups.get(emotion)!.push(item);
    });

    emotionGroups.forEach((items, emotion) => {
      if (items.length > 0) {
        albums.push({
          id: `emotion-${this.sanitizeId(emotion)}`,
          title: `${emotion}의 기억`,
          description: `${emotion}한 감정을 담은 소중한 순간들의 앨범입니다.`,
          theme: 'general',
          items: items,
          generatedAt: new Date(),
          classificationReason: `감정별 분류 (${emotion})`,
        });
      }
    });

    return albums;
  }

  /**
   * 아이템의 테마 결정
   */
  private determineItemTheme(item: AlbumItem): string {
    const title = item.title?.toLowerCase() || '';
    const location = item.metadata.location?.toLowerCase() || '';
    const tags = item.metadata.tags || [];

    // 자연 관련 키워드
    if (
      title.includes('해변') ||
      title.includes('산') ||
      title.includes('공원') ||
      location.includes('해변') ||
      location.includes('산') ||
      location.includes('공원') ||
      tags.some((tag) => ['자연', '풍경', '바다', '산'].includes(tag))
    ) {
      return 'nature';
    }

    // 역사 관련 키워드
    if (
      title.includes('박물관') ||
      title.includes('유적') ||
      title.includes('역사') ||
      location.includes('박물관') ||
      location.includes('유적') ||
      tags.some((tag) => ['역사', '문화재', '유적'].includes(tag))
    ) {
      return 'history';
    }

    // 음식 관련 키워드
    if (
      title.includes('맛집') ||
      title.includes('음식') ||
      title.includes('카페') ||
      location.includes('맛집') ||
      location.includes('음식') ||
      tags.some((tag) => ['맛집', '음식', '카페', '식당'].includes(tag))
    ) {
      return 'food';
    }

    // 문화 관련 키워드
    if (
      title.includes('공연') ||
      title.includes('전시') ||
      title.includes('문화') ||
      location.includes('공연') ||
      location.includes('전시') ||
      tags.some((tag) => ['문화', '공연', '전시', '예술'].includes(tag))
    ) {
      return 'culture';
    }

    return 'general';
  }

  /**
   * 시간대별 테마 결정
   */
  private determineThemeByTime(
    date: Date
  ): 'nature' | 'history' | 'food' | 'culture' | 'general' {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return 'nature'; // 아침 - 자연
    if (hour >= 12 && hour < 18) return 'culture'; // 오후 - 문화
    if (hour >= 18 && hour < 22) return 'food'; // 저녁 - 음식
    return 'general'; // 밤 - 일반
  }

  /**
   * 위치별 테마 결정
   */
  private determineThemeByLocation(
    location: string
  ): 'nature' | 'history' | 'food' | 'culture' | 'general' {
    const loc = location.toLowerCase();
    if (loc.includes('해변') || loc.includes('공원') || loc.includes('산'))
      return 'nature';
    if (loc.includes('박물관') || loc.includes('유적') || loc.includes('역사'))
      return 'history';
    if (loc.includes('맛집') || loc.includes('음식') || loc.includes('카페'))
      return 'food';
    if (loc.includes('공연') || loc.includes('전시') || loc.includes('문화'))
      return 'culture';
    return 'general';
  }

  /**
   * 활동별 테마 결정
   */
  private determineThemeByActivity(
    activity: string
  ): 'nature' | 'history' | 'food' | 'culture' | 'general' {
    const act = activity.toLowerCase();
    if (act.includes('산책') || act.includes('등산') || act.includes('해변'))
      return 'nature';
    if (act.includes('관광') || act.includes('박물관') || act.includes('유적'))
      return 'history';
    if (act.includes('식사') || act.includes('카페') || act.includes('맛집'))
      return 'food';
    if (act.includes('공연') || act.includes('전시') || act.includes('문화'))
      return 'culture';
    return 'general';
  }

  /**
   * 활동 결정
   */
  private determineActivity(item: AlbumItem): string {
    const title = item.title?.toLowerCase() || '';
    const location = item.metadata.location?.toLowerCase() || '';
    const tags = item.metadata.tags || [];

    if (title.includes('산책') || location.includes('공원')) return '산책';
    if (title.includes('식사') || location.includes('맛집')) return '식사';
    if (title.includes('관광') || location.includes('관광')) return '관광';
    if (title.includes('쇼핑') || location.includes('쇼핑')) return '쇼핑';
    if (title.includes('카페') || location.includes('카페')) return '카페';

    return '기타';
  }

  /**
   * 감정 결정
   */
  private determineEmotion(item: AlbumItem): string {
    const title = item.title?.toLowerCase() || '';
    const tags = item.metadata.tags || [];

    if (title.includes('즐거운') || tags.includes('즐거운')) return '즐거운';
    if (title.includes('평온한') || tags.includes('평온한')) return '평온한';
    if (title.includes('흥미로운') || tags.includes('흥미로운'))
      return '흥미로운';
    if (title.includes('감동적인') || tags.includes('감동적인'))
      return '감동적인';

    return '일반적인';
  }

  /**
   * 유틸리티 함수들
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private sanitizeId(str: string): string {
    return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  private getThemeTitle(theme: string): string {
    const titles = {
      nature: '자연과 함께한 순간들',
      history: '역사와 문화의 발자취',
      food: '맛있는 추억들',
      culture: '문화와 예술의 향기',
      general: '소중한 순간들',
    };
    return titles[theme as keyof typeof titles] || '소중한 순간들';
  }

  private getThemeDescription(theme: string): string {
    const descriptions = {
      nature: '자연 속에서 느낀 평온하고 아름다운 순간들을 담은 앨범입니다.',
      history: '역사적 의미가 있는 장소에서의 소중한 경험들을 담은 앨범입니다.',
      food: '맛있는 음식과 함께한 즐거운 순간들을 담은 앨범입니다.',
      culture: '문화와 예술을 통해 느낀 감동적인 순간들을 담은 앨범입니다.',
      general: '포항에서의 소중하고 특별한 순간들을 담은 앨범입니다.',
    };
    return (
      descriptions[theme as keyof typeof descriptions] ||
      '소중한 순간들을 담은 앨범입니다.'
    );
  }

  private getTimeOfDayTitle(timeOfDay: string): string {
    const titles = {
      morning: '아침의 포항',
      afternoon: '오후의 포항',
      evening: '저녁의 포항',
      night: '밤의 포항',
    };
    return titles[timeOfDay as keyof typeof titles] || '포항의 순간들';
  }

  private getTimeOfDayDescription(timeOfDay: string): string {
    const descriptions = {
      morning: '아침의 상쾌한 포항에서의 소중한 순간들을 담은 앨범입니다.',
      afternoon: '오후의 활기찬 포항에서의 즐거운 순간들을 담은 앨범입니다.',
      evening: '저녁의 아름다운 포항에서의 평온한 순간들을 담은 앨범입니다.',
      night: '밤의 신비로운 포항에서의 특별한 순간들을 담은 앨범입니다.',
    };
    return (
      descriptions[timeOfDay as keyof typeof descriptions] ||
      '포항에서의 소중한 순간들을 담은 앨범입니다.'
    );
  }
}
