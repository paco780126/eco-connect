export type PostCategory = '꿀템발견' | '집꾸미기' | '집들이' | '추천';

export interface CommunityPost {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  createdAt: string; // ISO 8601 date string
  views: number;
  likes: number;
  thumbnailUrl: string;
}

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-001',
    category: '꿀템발견',
    title: '이 천연 수세미 정말 물건이네요!',
    author: '김민준',
    createdAt: '2024-06-20T10:30:00Z',
    views: 152,
    likes: 22,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-002',
    category: '집꾸미기',
    title: '대나무 칫솔로 욕실 인테리어 포인트 주기',
    author: '이서아',
    createdAt: '2024-06-19T15:00:00Z',
    views: 254,
    likes: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629198731110-3853ec437a32?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-003',
    category: '추천',
    title: '에코 코넥트에서 첫 구매! 친환경 제품들 추천해요',
    author: '박도윤',
    createdAt: '2024-06-19T11:20:00Z',
    views: 310,
    likes: 58,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-004',
    category: '집들이',
    title: '제로 웨이스트로 꾸민 저희 집 소개합니다!',
    author: '최우진',
    createdAt: '2024-06-18T20:15:00Z',
    views: 520,
    likes: 102,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-005',
    category: '꿀템발견',
    title: '고체 샴푸바 써보신 분? 향이 너무 좋아요',
    author: '정다은',
    createdAt: '2024-06-18T09:00:00Z',
    views: 189,
    likes: 31,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629198729-799485834149?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-006',
    category: '집꾸미기',
    title: '업사이클링 데님 에코백으로 만든 벽걸이 수납함',
    author: '김지훈',
    createdAt: '2024-06-17T14:50:00Z',
    views: 98,
    likes: 15,
    thumbnailUrl: 'https://images.unsplash.com/photo-1594294892834-83e0a3597816?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-007',
    category: '추천',
    title: '반려동물 키우는 분들, 이 배변봉투 꼭 쓰세요',
    author: '박하은',
    createdAt: '2024-06-17T13:00:00Z',
    views: 412,
    likes: 78,
    thumbnailUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'post-008',
    category: '꿀템발견',
    title: '밀랍 랩, 한번 쓰면 비닐랩 못 써요',
    author: '이서아',
    createdAt: '2024-06-16T18:00:00Z',
    views: 333,
    likes: 65,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop',
  },
];