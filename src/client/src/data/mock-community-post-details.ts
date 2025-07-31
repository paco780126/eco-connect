export interface PostComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface PostDetailData {
  content: string;
  comments: PostComment[];
}

export const mockPostDetails: { [key: string]: PostDetailData } = {
  'post-001': {
    content: `<p>얼마 전에 에코 코넥트에서 산 천연 수세미인데, 정말 만족스러워서 후기 남겨요!</p>
              <p>처음에는 좀 뻣뻣한가 싶었는데 물 묻히니까 바로 부드러워지고 거품도 엄청 잘 나요. 플라스틱 수세미 쓸 때마다 미세플라스틱 걱정됐는데 이걸로 바꾸고 나니 마음이 편안하네요. 설거지할 때마다 기분이 좋아요. 강추합니다!</p>
              <img src="https://images.unsplash.com/photo-1629161229678-8382b956a9a3?q=80&w=800&auto=format&fit=crop" alt="천연 수세미" />`,
    comments: [
      { id: 'comment-1', author: '이서아', text: '오 저도 이거 살까 고민했는데, 후기 보니까 사야겠네요!', createdAt: '2024-06-20T11:00:00Z' },
      { id: 'comment-2', author: '박도윤', text: '맞아요! 이거 거품 진짜 잘 나죠! 저도 잘 쓰고 있어요.', createdAt: '2024-06-20T12:30:00Z' }
    ]
  },
  'post-002': {
    content: `<p>저희 집 욕실이에요! 얼마 전에 플라스틱 칫솔을 다 버리고 에코 코넥트에서 주문한 대나무 칫솔로 바꿨는데, 분위기가 확 달라졌어요.</p>
              <p>나무 소재가 주는 따뜻함이 있어서 그런지 욕실이 더 아늑하고 예뻐진 느낌이에요. 별거 아닌 것 같아도 이런 작은 변화가 삶의 질을 높여주는 것 같아요. 환경도 생각하고 인테리어도 챙기고, 일석이조네요!</p>
              <img src="https://images.unsplash.com/photo-1629198731110-3853ec437a32?q=80&w=800&auto=format&fit=crop" alt="대나무 칫솔이 놓인 욕실" />`,
    comments: [
      { id: 'comment-3', author: '김민준', text: '우와, 정말 예쁘네요. 저희 집도 바꿔봐야겠어요.', createdAt: '2024-06-19T16:00:00Z' },
    ]
  },
  'post-003': {
    content: `<p>친환경 제품에 관심이 많아서 에코 코넥트를 알게 됐는데, 첫 구매 완전 성공적이라 추천 글 올립니다!</p>
              <p>고체 샴푸바, 대나무 칫솔, 천연 수세미 이렇게 3개 사봤는데 하나같이 다 마음에 들어요. 특히 고체 샴푸바는 거품도 풍성하고 머릿결도 부드러워져서 놀랐어요. 앞으로 쇼핑은 여기서만 할 것 같아요!</p>`,
    comments: []
  },
  'post-004': {
    content: `<p>안녕하세요! 얼마 전부터 제로 웨이스트 라이프를 실천하고 있는 새내기입니다. 저희 집 주방을 살짝 공개해요.</p>
              <p>밀랍 랩으로 음식 보관하고, 웬만한 건 다 유리병에 담아서 쓰려고 노력 중이에요. 아직은 서툴고 부족하지만, 쓰레기가 줄어드는 걸 보면 정말 뿌듯하답니다. 다들 같이 동참해요!</p>
              <img src="https://images.unsplash.com/photo-1598622137941-86411119b986?q=80&w=800&auto=format&fit=crop" alt="제로 웨이스트 주방" />`,
    comments: [
      { id: 'comment-4', author: '정다은', text: '정말 대단하세요! 저도 도전해보고 싶은데 어디서부터 시작해야 할지 막막하네요.', createdAt: '2024-06-19T09:20:00Z' },
      { id: 'comment-5', author: '최우진', text: '다이소 같은 곳에서 유리병 저렴하게 사서 시작해보세요! 저도 그랬어요 ㅎㅎ', createdAt: '2024-06-19T10:00:00Z' }
    ]
  },
};