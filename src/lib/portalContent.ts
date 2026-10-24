// 포털(/) 정적 콘텐츠 — 서비스 카드는 하드코딩이 아니라 이 데이터로 렌더링한다.
export type PortalService = {
  key: 'pace' | 'aim' | 'plants' | 'santa' | 'lii'
  no: string
  name: string
  title: string
  desc: string
  url: string
  image?: string // 지정하지 않으면 해당 서비스 피드의 대표 이미지(service_images)를 쓴다
}

export const PORTAL_SERVICES: PortalService[] = [
  { key: 'pace', no: '01', name: 'PACE', title: '지금 뜨는 곳', desc: '핫플레이스, 팝업, 전시, 지역의 새로운 움직임', url: 'https://now.nemoneai.com' },
  { key: 'aim', no: '02', name: 'AIM', title: '지금 변하는 맛의 세계', desc: '미식 트렌드, 식재료, 외식문화의 변화', url: '/aim' },
  { key: 'plants', no: '03', name: 'Plants', title: '살아가는 것들의 변화', desc: '식물의 성장, 계절별 관리, 초보 집사 기록', url: 'https://plants.nemoneai.com' },
  { key: 'santa', no: '04', name: '산타', title: '나를 이야기하고, 마음을 돌보는 시간', desc: '칭찬 카드, 자기이해 콘텐츠, 따뜻한 응원', url: 'https://santa.nemoneai.com', image: '/portal/santa-card.jpg' },
  { key: 'lii', no: '05', name: 'LII', title: '기업의 과거를 분석하고 미래를 봅니다', desc: '5년 재무 기반 AI 기업분석, 매일 업데이트', url: 'https://msm.nemoneai.com' },
]

// 와랑스튜디오 LAB — 포털에 항상 노출
export const PORTAL_LAB = {
  title: '와랑스튜디오 LAB',
  lines: ['판교 직장인의', '제주 집짓기 이야기'],
  button: '이야기 보기',
  url: '/special/1',
  image: '/portal/lab.jpg',
}

// 오늘의 한마디(산타) — 무료 문구만. 날짜로 하루 1개씩 돌린다. 유료 편지·선물은 산타 서비스 안에서.
export const SANTA_QUOTES: { quote: string; sub: string }[] = [
  { quote: '당신은 생각보다 지금도 충분히 잘하고 있어요.', sub: '오늘도, 당신의 이야기를 응원합니다.' },
  { quote: '큰 일을 해내지 않아도, 오늘 하루를 버틴 것만으로 대단해요.', sub: '잠깐 숨 돌리고 가도 괜찮아요.' },
  { quote: '남들이 모르는 당신의 노력이 분명 쌓이고 있어요.', sub: '산타는 그걸 알아보고 있답니다.' },
  { quote: '서툴렀던 날의 당신도 나름의 최선이었어요.', sub: '그 마음을 오늘은 스스로 알아봐 주세요.' },
  { quote: '당신이 건넨 작은 다정함은 누군가의 하루를 바꿨을지도 몰라요.', sub: '오늘도 그 마음, 잃지 마세요.' },
  { quote: '조금 느려도 괜찮아요. 방향이 맞으면 도착하니까요.', sub: '당신의 속도를 응원합니다.' },
  { quote: '잘 해내지 못한 날에도 당신의 가치는 그대로예요.', sub: '오늘은 스스로에게 다정해져요.' },
]

// 오늘의 운세 — 1차는 정적 샘플(띠 12개). 실제 생성(하루 12회 LLM + 캐시)은 2차에서 연결한다.
export const ZODIACS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'] as const
export const FORTUNE_SAMPLES: string[] = [
  '오래 미뤄 둔 연락을 먼저 건네기 좋은 날이에요. 짧은 안부 한 줄이 분위기를 풀어 줍니다.',
  '서두르기보다 한 번 더 확인하는 쪽이 이득인 날. 작은 정리가 마음의 여유를 만들어요.',
  '새로운 사람보다 익숙한 사람에게서 힌트를 얻는 하루. 가볍게 이야기를 나눠 보세요.',
  '오늘은 컨디션 관리가 먼저예요. 따뜻한 음료 한 잔과 가벼운 산책이 흐름을 바꿔 줍니다.',
  '하고 싶던 일을 아주 작게 시작해 보세요. 첫 10분이 하루의 방향을 정해 줘요.',
  '비교보다 기록이 힘이 되는 날. 오늘 해낸 일을 한 줄로 적어 두면 든든해집니다.',
  '약속과 일정이 겹치기 쉬운 날이니 우선순위를 먼저 정하세요. 여유가 오히려 성과를 키웁니다.',
  '작은 칭찬이 큰 힘이 되는 날. 주변에 먼저 고마움을 표현하면 그 마음이 돌아와요.',
  '예상 밖의 변화가 있어도 크게 흔들리지 않아도 돼요. 한 걸음 물러서 보면 길이 보입니다.',
  '집중이 잘 되는 시간대를 놓치지 마세요. 중요한 일은 오전에, 정리는 오후에 두는 편이 좋아요.',
  '새로운 정보를 접하기 좋은 날. 평소 가지 않던 곳이나 글을 하나 골라 보세요.',
  '오늘은 나를 위한 작은 보상이 필요한 날. 좋아하는 한 끼가 에너지를 채워 줍니다.',
]

// 하단 SNS·링크
export const PORTAL_SNS = [
  { name: 'Instagram', href: 'https://www.instagram.com/nemone_pace/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@nemoneaim' },
  { name: 'Podcast', href: 'https://podcasts.apple.com/kr/channel/%EB%84%A4%EB%AA%A8%EB%84%A4aim/id6753140870' },
  { name: 'Blog', href: 'https://brunch.co.kr/@you1' },
]

export const CATEGORY_LABEL: Record<string, string> = {
  PLACE: 'PLACE', TASTE: 'TASTE', LIFE: 'LIFE', MIND: 'MIND', FUTURE: 'FUTURE',
}
