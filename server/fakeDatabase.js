export const users = [
  { id: 1, name: '테스트유저', email: 'user@test.com', password: 'password123', role: 'user', status: '정상' },
  { id: 2, name: '관리자', email: 'admin@test.com', password: 'password123', role: 'admin', status: '정상' }
];

export let posts = [
  {
    id: 'post-001',
    category: '꿀템발견',
    title: '이 천연 수세미 정말 물건이네요!',
    author: '테스트유저',
    createdAt: '2024-06-20T10:30:00Z',
    views: 152,
    likes: 22,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop',
    content: `<p>얼마 전에 에코 코넥트에서 산 천연 수세미인데, 정말 만족스러워서 후기 남겨요!</p><p>플라스틱 수세미 쓸 때마다 미세플라스틱 걱정됐는데 이걸로 바꾸고 나니 마음이 편안하네요. 설거지할 때마다 기분이 좋아요. 강추합니다!</p><img src="https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop" alt="천연 수세미" />`
  },
  {
    id: 'post-002',
    category: '집꾸미기',
    title: '대나무 칫솔로 욕실 인테리어 포인트 주기',
    author: '관리자',
    createdAt: '2024-06-19T15:00:00Z',
    views: 254,
    likes: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629198731110-3853ec437a32?q=80&w=800&auto=format&fit=crop',
    content: `<p>저희 집 욕실이에요! 얼마 전에 플라스틱 칫솔을 다 버리고 에코 코넥트에서 주문한 대나무 칫솔로 바꿨는데, 분위기가 확 달라졌어요.</p><img src="https://images.unsplash.com/photo-1629198731110-3853ec437a32?q=80&w=800&auto=format&fit=crop" alt="대나무 칫솔이 놓인 욕실" />`
  },
   {
    id: 'post-003',
    category: '추천',
    title: '에코 코넥트에서 첫 구매! 친환경 제품들 추천해요',
    author: '테스트유저',
    createdAt: '2024-06-19T11:20:00Z',
    views: 310,
    likes: 58,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=800&auto=format&fit=crop',
    content: `<p>친환경 제품에 관심이 많아서 에코 코넥트를 알게 됐는데, 첫 구매 완전 성공적이라 추천 글 올립니다!</p>`
  },
  {
    id: 'post-004',
    category: '집들이',
    title: '제로 웨이스트로 꾸민 저희 집 소개합니다!',
    author: '관리자',
    createdAt: '2024-06-18T20:15:00Z',
    views: 520,
    likes: 102,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop',
    content: `<p>안녕하세요! 얼마 전부터 제로 웨이스트 라이프를 실천하고 있는 새내기입니다. 저희 집 주방을 살짝 공개해요.</p><img src="https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop" alt="제로 웨이스트 주방" />`
  },
];

export let comments = [
  { id: 'comment-1', postId: 'post-001', author: '관리자', text: '오 저도 이거 살까 고민했는데, 후기 보니까 사야겠네요!', createdAt: '2024-06-20T11:00:00Z' },
  { id: 'comment-2', postId: 'post-001', author: '테스트유저', text: '맞아요! 이거 거품 진짜 잘 나죠! 저도 잘 쓰고 있어요.', createdAt: '2024-06-20T12:30:00Z' },
  { id: 'comment-3', postId: 'post-002', author: '테스트유저', text: '우와, 정말 예쁘네요. 저희 집도 바꿔봐야겠어요.', createdAt: '2024-06-19T16:00:00Z' },
  { id: 'comment-4', postId: 'post-004', author: '테스트유저', text: '정말 대단하세요! 저도 도전해보고 싶은데 어디서부터 시작해야 할지 막막하네요.', createdAt: '2024-06-19T09:20:00Z' },
  { id: 'comment-5', postId: 'post-004', author: '관리자', text: '다이소 같은 곳에서 유리병 저렴하게 사서 시작해보세요! 저도 그랬어요 ㅎㅎ', createdAt: '2024-06-19T10:00:00Z' }
];

export const orders = [
  {
    orderId: '20240601-0005',
    orderDate: '2024.06.01',
    userId: 1, // user@test.com
    items: [
      { productId: 'prod-004', productName: '태양광 충전 보조배터리 10000mAh', quantity: 1, price: 45000 }
    ],
    status: '배송중'
  },
  {
    orderId: '20240521-0001',
    orderDate: '2024.05.21',
    userId: 1, // user@test.com
    items: [
      { productId: 'prod-001', productName: '친환경 대나무 칫솔 (4개입)', quantity: 1, price: 9900 },
      { productId: 'prod-002', productName: '유기농 천연 수세미 (3개 세트)', quantity: 2, price: 7500 }
    ],
    status: '배송완료'
  }
];

export const mockProducts = [
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
