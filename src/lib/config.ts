// API 설정
export const config = {
  // Kakao Map API 키 (실제 배포 시 환경 변수로 관리)
  kakaoMapApiKey:
    process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ||
    'your_kakao_map_api_key_here',

  // Google Maps API 키 (실제 배포 시 환경 변수로 관리)
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    'your_google_maps_api_key_here',

  // OpenAI API 키 (실제 배포 시 환경 변수로 관리)
  openaiApiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',

  // 기본 설정
  defaultMapCenter: {
    lat: 36.019, // 포항시 중심
    lng: 129.3435,
  },

  // 지도 기본 줌 레벨
  defaultZoomLevel: 12,

  // 마커 아이콘 설정
  markerIcons: {
    default:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
    start:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png',
    end: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerBlue.png',
    waypoint:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png',
  },
};
