import { Product, mockProducts } from './mock-products';

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  isUser?: boolean;
}

export interface LiveStream {
  id: string;
  title: string;
  hostName: string;
  viewerCount: number;
  videoUrl: string;
  relatedProductIds: string[];
  chatMessages: ChatMessage[];
}

export const mockLiveStreams: { [key: string]: LiveStream } = {
  'live-001': {
    id: 'live-001',
    title: '🌿 에코코넥트 주방용품 특별 라이브!',
    hostName: '에코 메이트',
    viewerCount: 1342,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    relatedProductIds: ['prod-002', 'prod-003', 'prod-007'],
    chatMessages: [
      { id: 'chat-1', author: '김민준', text: '안녕하세요! 라이브 시작했네요!' },
      { id: 'chat-2', author: '이서아', text: '오늘 제품들 기대돼요!!' },
      { id: 'chat-3', author: '박도윤', text: '수세미 어떤가요? 써보신 분?' },
      { id: 'chat-4', author: '에코 메이트', text: '박도윤님, 저희 천연 수세미는 거품도 잘나고 식기에 흠집도 안나요! 강력 추천합니다!👍' },
      { id: 'chat-5', author: '정다은', text: '밀랍 랩은 어떻게 관리해야 하나요?' },
    ],
  },
};

export const getProductsByIds = (ids: string[]): Product[] => {
  return ids.map(id => mockProducts.find(p => p.id === id)).filter((p): p is Product => !!p);
};
