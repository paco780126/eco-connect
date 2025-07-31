export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: '주방' | '생활' | '욕실' | '반려동물';
  createdAt: string; // ISO 8601 date string
}

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: '친환경 대나무 칫솔 (4개입)',
    price: 9900,
    imageUrl: 'https://images.unsplash.com/photo-1589821037529-f705625141dd?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-10T10:00:00Z',
  },
  {
    id: 'prod-002',
    name: '유기농 천연 수세미 (3개 세트)',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-06-12T11:30:00Z',
  },
  {
    id: 'prod-003',
    name: '리사이클 유리컵 (2개 세트)',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1616130198143-2f983a54a867?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-05-28T14:00:00Z',
  },
  {
    id: 'prod-004',
    name: '태양광 충전 보조배터리 10000mAh',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1593592419825-9a918a58e65e?q=80&w=800&auto=format&fit=crop',
    category: '생활',
    createdAt: '2024-06-15T09:00:00Z',
  },
  {
    id: 'prod-005',
    name: '고체 샴푸바 (시트러스향)',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1629198729-799485834149?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-05T18:00:00Z',
  },
  {
    id: 'prod-006',
    name: '생분해 강아지 배변봉투 (120매)',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
    category: '반려동물',
    createdAt: '2024-06-11T16:20:00Z',
  },
  {
    id: 'prod-007',
    name: '밀랍 식품 포장 랩 (3종 사이즈)',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop',
    category: '주방',
    createdAt: '2024-06-14T13:00:00Z',
  },
  {
    id: 'prod-008',
    name: '업사이클링 데님 에코백',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1594294892834-83e0a3597816?q=80&w=800&auto=format&fit=crop',
    category: '생활',
    createdAt: '2024-05-20T11:00:00Z',
  },
    {
    id: 'prod-009',
    name: '옥수수 전분 칫솔꽂이',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1608571424266-92171b3e80c4?q=80&w=800&auto=format&fit=crop',
    category: '욕실',
    createdAt: '2024-06-13T08:45:00Z',
  },
  {
    id: 'prod-010',
    name: '대나무 원목 고양이 낚시대',
    price: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69841006?q=80&w=800&auto=format&fit=crop',
    category: '반려동물',
    createdAt: '2024-06-01T12:00:00Z',
  },
];
