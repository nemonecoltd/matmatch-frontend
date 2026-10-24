// 포털(/) 정적 콘텐츠 — 서비스 카드는 하드코딩이 아니라 이 데이터로 렌더링한다.
export type PortalService = {
  key: 'pace' | 'aim' | 'plants' | 'santa' | 'lii'
  no: string
  name: string
  title: string
  desc: string
  url: string
  image: string // 각 서비스의 OG(대표) 이미지 — /public/portal/og-*.jpg
}

export const PORTAL_SERVICES: PortalService[] = [
  { key: 'pace', no: '01', name: 'PACE', title: '지금 뜨는 곳', desc: '핫플레이스, 팝업, 전시, 지역의 새로운 움직임', url: 'https://now.nemoneai.com', image: '/portal/og-pace.jpg' },
  { key: 'aim', no: '02', name: 'AIM', title: '지금 변하는 맛의 세계', desc: '미식 트렌드, 식재료, 외식문화의 변화', url: '/aim', image: '/portal/og-aim.jpg' },
  { key: 'plants', no: '03', name: 'Plants', title: '살아가는 것들의 변화', desc: '식물의 성장, 계절별 관리, 초보 집사 기록', url: 'https://plants.nemoneai.com', image: '/portal/og-plants.jpg' },
  { key: 'santa', no: '04', name: '산타', title: '나를 이야기하고, 마음을 돌보는 시간', desc: '칭찬 카드, 자기이해 콘텐츠, 따뜻한 응원', url: 'https://santa.nemoneai.com', image: '/portal/og-santa.jpg' },
  { key: 'lii', no: '05', name: 'LII', title: '기업의 과거를 분석하고 미래를 봅니다', desc: '5년 재무 기반 AI 기업분석, 매일 업데이트', url: 'https://msm.nemoneai.com', image: '/portal/og-lii.jpg' },
]

// 와랑스튜디오 LAB — 포털에 항상 노출(서비스 5칸과 별개로 아래 가로 띠로)
export const PORTAL_LAB = {
  title: '와랑스튜디오 LAB',
  lines: ['판교 직장인의 제주 집짓기 이야기', '집을 짓는 일에서 배우는 삶의 방식'],
  button: '이야기 보기',
  url: 'https://map.naver.com/p/entry/place/2065456826',
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

// 하단 SNS·링크
export const PORTAL_SNS = [
  { name: 'Instagram', href: 'https://www.instagram.com/nemone_pace/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@nemoneaim' },
  { name: 'Podcast', href: 'https://podcasts.apple.com/kr/channel/%EB%84%A4%EB%AA%A8%EB%84%A4aim/id6753140870' },
  { name: 'Blog', href: 'https://blog.naver.com/nemoneaim' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61572151718459' },
]

export const CATEGORY_LABEL: Record<string, string> = {
  PLACE: 'PLACE', TASTE: 'TASTE', LIFE: 'LIFE', MIND: 'MIND', FUTURE: 'FUTURE',
}
