export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: '주방' | '생활' | '욕실' | '반려동물';
  createdAt: string; // ISO 8601 date string
  brand: string;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: '친환경 대나무 칫솔 (4개입)',
    price: 9900,
    imageUrl: 'https://images.unsplash.com/photo-1589821037529-f705625141dd?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-10T10:00:00Z',
    brand: '에코 프렌즈',
    description: '<p>자연을 생각하는 당신의 선택, 100% 생분해되는 대나무 칫솔입니다. 플라스틱 사용을 줄이고 건강한 구강 관리를 시작하세요.</p><p>에코 코넥트의 친환경 대나무 칫솔은 지속 가능한 방식으로 재배된 모소(Moso) 대나무로 만들어졌습니다.</p>'
  },
  {
    id: 'prod-002',
    name: '유기농 천연 수세미 (3개 세트)',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-06-12T11:30:00Z',
    brand: '네이처 클린',
    description: '<p>화학 성분 걱정 없는 100% 천연 수세미로 설거지 시간을 더 건강하게 만들어보세요. 기름기 제거에도 효과적입니다.</p><p>열대지방에서 자라는 수세미오이를 그대로 말려 만든 제품으로, 어떤 화학 처리도 거치지 않았습니다.</p>'
  },
  {
    id: 'prod-003',
    name: '리사이클 유리컵 (2개 세트)',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1616130198143-2f983a54a867?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-05-28T14:00:00Z',
    brand: '리글라스',
    description: '<p>폐유리병을 재활용하여 만든 아름다운 유리컵입니다. 환경을 보호하면서 감성적인 테이블을 연출해보세요.</p>'
  },
  {
    id: 'prod-004',
    name: '태양광 충전 보조배터리 10000mAh',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1593592419825-9a918a58e65e?q=80&w=800&auto=format&fit=crop',
    category: '생활',
    createdAt: '2024-06-15T09:00:00Z',
    brand: '솔라 파워',
    description: '<p>언제 어디서나 태양광으로 충전! 아웃도어 활동과 비상시에 필수적인 친환경 보조배터리입니다.</p><p><strong>주의:</strong> 태양광 충전은 보조 기능이며, 주된 충전은 일반 어댑터를 이용하시는 것을 권장합니다.</p>'
  },
  {
    id: 'prod-005',
    name: '고체 샴푸바 (시트러스향)',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1629198729-799485834149?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-05T18:00:00Z',
    brand: '그린 버블',
    description: '<p>플라스틱 용기가 필요 없는 고체 샴푸바입니다. 천연 유래 성분으로 두피를 건강하게, 머릿결을 부드럽게 가꿔줍니다.</p>'
  },
  {
    id: 'prod-006',
    name: '생분해 강아지 배변봉투 (120매)',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
    category: '반려동물',
    createdAt: '2024-06-11T16:20:00Z',
    brand: '펫 그린',
    description: '<p>옥수수 전분으로 만들어 100% 생분해되는 착한 배변봉투입니다. 소중한 반려동물과의 산책을 더욱 의미있게 만들어보세요.</p>'
  },
  {
    id: 'prod-007',
    name: '밀랍 식품 포장 랩 (3종 사이즈)',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-06-14T13:00:00Z',
    brand: '비즈왁스 랩',
    description: '<p>일회용 비닐랩을 대체하는 다회용 밀랍 랩입니다. 식품을 신선하게 보관하고 쓰레기를 줄일 수 있습니다.</p>'
  },
  {
    id: 'prod-008',
    name: '업사이클링 데님 에코백',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1594294892834-83e0a3597816?q=80&w=800&auto=format&fit=crop',
    category: '생활',
    createdAt: '2024-05-20T11:00:00Z',
    brand: '리-진',
    description: '<p>버려지는 청바지를 재활용하여 만든 세상에 하나뿐인 에코백입니다. 튼튼하고 스타일리시하여 데일리 백으로 활용하기 좋습니다.</p>'
  },
  {
    id: 'prod-009',
    name: '옥수수 전분 칫솔꽂이',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1608571424266-92171b3e80c4?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-13T08:45:00Z',
    brand: '콘-데코',
    description: '<p>PLA(옥수수 전분)로 만들어진 친환경 칫솔꽂이입니다. 미니멀한 디자인으로 어떤 욕실에도 잘 어울립니다.</p>'
  },
  {
    id: 'prod-010',
    name: '대나무 원목 고양이 낚시대',
    price: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69841006?q=80&w=800&auto=format&fit=crop',
    category: '반려동물',
    createdAt: '2024-06-01T12:00:00Z',
    brand: '캣닢가든',
    description: '<p>튼튼한 대나무 원목으로 만들어진 고양이 낚시대 장난감입니다. 플라스틱 대신 자연 소재로 고양이와 즐거운 시간을 보내세요.</p>'
  }
];
