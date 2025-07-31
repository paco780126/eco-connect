export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  text: string;
  date: string;
}

export interface QuestionAnswer {
  id: string;
  questioner: string;
  question: string;
  questionDate: string;
  answerer: string;
  answer: string;
  answerDate: string;
}

export interface ProductDetail {
  galleryImages: string[];
  shortDescription: string;
  longDescription: string;
  reviews: Review[];
  qna: QuestionAnswer[];
}

interface ProductDetailsMap {
  [key: string]: ProductDetail;
}

export const mockProductDetails: ProductDetailsMap = {
  'prod-001': {
    galleryImages: [
      'https://images.unsplash.com/photo-1589821037529-f705625141dd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629198731089-a5ade0a8a67c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629198731110-3853ec437a32?q=80&w=800&auto=format&fit=crop',
    ],
    shortDescription: '자연을 생각하는 당신의 선택, 100% 생분해되는 대나무 칫솔입니다. 플라스틱 사용을 줄이고 건강한 구강 관리를 시작하세요.',
    longDescription: `
      <p>에코 코넥트의 친환경 대나무 칫솔은 지속 가능한 방식으로 재배된 모소(Moso) 대나무로 만들어졌습니다. 모소 대나무는 판다가 먹지 않는 종류로, 생태계를 해치지 않습니다.</p>
      <p>칫솔모는 BPA가 없는 나일론6로 제작되었으며, 부드러운 미세모가 잇몸에 자극 없이 치아 구석구석을 깨끗하게 닦아줍니다.</p>
      <ul>
        <li><strong>소재:</strong> 대나무 손잡이, 나일론6 칫솔모</li>
        <li><strong>특징:</strong> 100% 생분해 가능한 손잡이, BPA Free</li>
        <li><strong>수량:</strong> 4개입</li>
      </ul>
    `,
    reviews: [
      { id: 'rev-1', author: '김민준', rating: 5, text: '디자인도 예쁘고 환경을 생각하는 제품이라 더 마음에 들어요. 칫솔모도 부드럽고 좋습니다.', date: '2024-06-15' },
      { id: 'rev-2', author: '이서아', rating: 4, text: '플라스틱 칫솔을 쓰다가 바꿔봤는데 만족합니다. 다만, 습기 관리를 잘 해줘야 할 것 같아요.', date: '2024-06-12' },
    ],
    qna: [
      { id: 'qa-1', questioner: '박하은', question: '칫솔모도 생분해가 되나요?', questionDate: '2024-06-11', answerer: '에코 코넥트', answer: '안녕하세요, 오빠! 칫솔모는 현재 나일론6 소재로 생분해가 어렵습니다. 폐기 시에는 칫솔모를 펜치 등으로 뽑아 일반쓰레기로 분리 배출하고, 손잡이만 재활용 또는 일반쓰레기로 버려주세요!', answerDate: '2024-06-11' },
    ],
  },
  'prod-002': {
    galleryImages: [
      'https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590846491763-71a741369528?q=80&w=800&auto=format&fit=crop',
    ],
    shortDescription: '화학 성분 걱정 없는 100% 천연 수세미로 설거지 시간을 더 건강하게 만들어보세요. 기름기 제거에도 효과적입니다.',
    longDescription: `
      <p>열대지방에서 자라는 수세미오이를 그대로 말려 만든 제품으로, 어떤 화학 처리도 거치지 않았습니다. 처음에는 뻣뻣하게 느껴질 수 있지만 물에 닿으면 부드러워져 식기에 흠집을 내지 않습니다.</p>
      <p>사용 후에는 물기를 짜서 통풍이 잘 되는 곳에 말려주시면 더 오래 위생적으로 사용할 수 있습니다.</p>
    `,
    reviews: [
      { id: 'rev-3', author: '최우진', rating: 5, text: '거품도 잘 나고 정말 잘 닦여요. 환경에 좋다고 하니 더 좋네요!', date: '2024-06-14' },
    ],
    qna: [],
  },
  'prod-004': {
    galleryImages: [
      'https://images.unsplash.com/photo-1593592419825-9a918a58e65e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616892308903-887727543343?q=80&w=800&auto=format&fit=crop',
    ],
    shortDescription: '언제 어디서나 태양광으로 충전! 아웃도어 활동과 비상시에 필수적인 친환경 보조배터리입니다.',
    longDescription: `
      <p>고효율 태양광 패널이 장착되어 있어 햇빛만 있다면 언제든지 충전이 가능합니다. 10000mAh의 넉넉한 용량으로 스마트폰을 여러 번 충전할 수 있으며, 2개의 USB 포트를 지원하여 동시 충전도 가능합니다.</p>
      <p><strong>주의:</strong> 태양광 충전은 보조 기능이며, 주된 충전은 일반 어댑터를 이용하시는 것을 권장합니다. 태양광 충전 속도는 날씨와 환경에 따라 크게 달라질 수 있습니다.</p>
    `,
    reviews: [
        { id: 'rev-4', author: '박도윤', rating: 5, text: '캠핑갈 때 정말 유용하게 썼어요. 튼튼하고 충전도 잘 됩니다.', date: '2024-06-18' },
        { id: 'rev-5', author: '정다은', rating: 4, text: '생각보다 조금 무겁지만 성능은 만족스러워요. 햇빛 좋을 때 창가에 두면 충전이 되니 신기하네요.', date: '2024-06-17' },
    ],
    qna: [
      { id: 'qa-2', questioner: '김지훈', question: '완전 방전 상태에서 태양광으로 완충하려면 얼마나 걸리나요?', questionDate: '2024-06-16', answerer: '에코 코넥트', answer: '안녕하세요, 오빠! 좋은 질문이에요. 태양광 충전은 날씨에 따라 효율이 많이 달라져서 정확한 시간을 말씀드리긴 어렵지만, 이상적인 조건에서도 수 일이 걸릴 수 있어요. 비상시를 위한 보조 기능으로 생각해주시면 가장 좋습니다!', answerDate: '2024-06-16' },
    ],
  },
};
