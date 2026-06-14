import { MetadataRoute } from 'next'

export const revalidate = 3600 // 1시간마다 사이트맵 재생성

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nemoneai.com'
  
  // 1. 모든 게시물 데이터 가져오기
  let posts: any[] = []
  let specials: any[] = []
  try {
    const [resPosts, resSpecials] = await Promise.all([
      fetch('http://127.0.0.1:8080/posts?limit=10000', { next: { revalidate: 3600 } }),
      fetch('http://127.0.0.1:8080/specials', { next: { revalidate: 3600 } })
    ])
    
    if (resPosts.ok) {
      const data = await resPosts.json()
      posts = Array.isArray(data) ? data : (data.posts || [])
    }
    if (resSpecials.ok) {
      specials = await resSpecials.json()
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error)
  }

  // 2. 게시물 상세 페이지 URL 생성
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const specialUrls = specials.map((s) => ({
    url: `${baseUrl}/special/${s.id}`,
    lastModified: new Date(s.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. 고정 페이지 URL 생성 (nemoneai.com 도메인만 포함)
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/special`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/category/Taste`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/category/Culture`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/category/Life`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/category/Tech`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
  ]

  return [...staticUrls, ...postUrls, ...specialUrls]
}
