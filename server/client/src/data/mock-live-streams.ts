
export interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  thumbnailUrl: string;
  viewerCount: number;
  videoUrl: string; // Youtube embed URL
  productId: string; // 방송 메인 상품 ID
  category: '뷰티' | '패션' | '식품' | '라이프' | '테크';
}


export const mockLiveStreams: LiveStream[] = [
  {
    id: 'live-001',
    title: '🌿 에코코넥트 주방용품 특별 라이브!',
    streamer: '에코 메이트',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812db9?q=80&w=800&auto=format&fit=crop',
    viewerCount: 1342,
    videoUrl: 'https://www.youtube.com/embed/vX2vsv_dABs?autoplay=1&mute=1&controls=0',
    productId: 'prod-002',
    category: '식품',
  },
  {
    id: 'live-002',
    title: '🐶 우리 댕댕이를 위한 친환경 장난감!',
    streamer: '펫 러버',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
    viewerCount: 876,
    videoUrl: 'https://www.youtube.com/embed/IO5w83fC6gU?autoplay=1&mute=1&controls=0',
    productId: 'prod-010',
    category: '라이프',
  },
  {
    id: 'live-003',
    title: '✨ 반짝이는 피부를 위한 비건 뷰티템',
    streamer: '뷰티 지수',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    viewerCount: 2109,
    videoUrl: 'https://www.youtube.com/embed/S_dfq9rFWAE?autoplay=1&mute=1&controls=0',
    productId: 'prod-005',
    category: '뷰티',
  },
  {
    id: 'live-004',
    title: 'SS시즌 대비! 지속가능 패션 아이템',
    streamer: '스타일 마스터',
    thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    viewerCount: 1870,
    videoUrl: 'https://www.youtube.com/embed/2OR2q6-pX6U?autoplay=1&mute=1&controls=0',
    productId: 'prod-008',
    category: '패션',
  },
  {
    id: 'live-005',
    title: '최신 친환경 테크 기기 언박싱!',
    streamer: '테크 오빠',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop',
    viewerCount: 950,
    videoUrl: 'https://www.youtube.com/embed/dYw4meRWGd4?autoplay=1&mute=1&controls=0',
    productId: 'prod-004',
    category: '테크',
  },
   {
    id: 'live-006',
    title: '제로-웨이스트, 우리집 주방 꾸미기',
    streamer: '살림의 여왕',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e4a733737353?q=80&w=800&auto=format&fit=crop',
    viewerCount: 1123,
    videoUrl: 'https://www.youtube.com/embed/s2skans2dP0?autoplay=1&mute=1&controls=0',
    productId: 'prod-007',
    category: '라이프',
  },
];
