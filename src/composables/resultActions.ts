import type { Menu, ResultAction } from '@/types'

export function buildResultActions(menu: Menu): ResultAction[] {
  const q = encodeURIComponent(menu.name)

  return [
    {
      type: 'capture',
      label: '먹고 사진 찍기',
      route: '/capture',
    },
    {
      type: 'mealkit',
      label: '집에서 만들기',
      url: `https://www.coupang.com/np/search?q=${q}`,
      trackingId: 'coupang-search',
    },
    {
      type: 'map',
      label: '근처 식당',
      url: `https://map.naver.com/p/search/${q}`,
      trackingId: 'naver-map',
    },
    {
      type: 'delivery',
      label: '배달 주문',
      url: `https://www.baemin.com/search?query=${q}`,
      trackingId: 'baemin-search',
    },
  ]
}
