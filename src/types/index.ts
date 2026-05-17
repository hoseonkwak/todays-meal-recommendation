export type Category = '한식' | '일식' | '중식' | '양식' | '분식' | '아시안' | '기타'

export type MealType = 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'latenight'

export type DecisionMode = 'quick' | 'tournament' | 'slot'

export type DecisionOutcome = 'eaten' | 'passed' | 'unknown'

export type Theme = 'system' | 'light' | 'dark'

export type ReelAutoGenerate = 'daily' | 'weekly' | 'manual'

export type ReelAspect = '9:16' | '1:1' | '16:9'

export type ResultActionType = 'mealkit' | 'map' | 'delivery' | 'capture' | 'sponsor'

export interface TimeFitness {
  breakfast: number
  brunch: number
  lunch: number
  dinner: number
  latenight: number
}

export interface DayOfWeekFitness {
  weekday: number
  weekend: number
}

export interface WeatherFitness {
  cold: number
  hot: number
  rainy: number
}

export interface MenuFitness {
  time: TimeFitness
  dayOfWeek: DayOfWeekFitness
  weather: WeatherFitness
}

export interface Menu {
  id: string
  name: string
  category: Category
  tags: string[]
  fitness: MenuFitness
}

export interface DecisionEntry {
  id: string
  menuId: string
  timestamp: string
  outcome: DecisionOutcome
  mode: DecisionMode
  mealType: MealType
}

export interface Location {
  lat: number
  lng: number
  placeName?: string
}

export interface MealPhoto {
  id: string
  menuId?: string
  menuName: string
  imageBlob: Blob
  thumbnailBlob: Blob
  takenAt: string
  location?: Location
  mealType: MealType
  note?: string
}

export interface Reel {
  id: string
  range: { from: string; to: string }
  photoIds: string[]
  template: string
  aspect: ReelAspect
  videoBlob?: Blob
  createdAt: string
}

export interface ResultAction {
  type: ResultActionType
  label: string
  url?: string
  route?: string
  trackingId?: string
}

export interface Preferences {
  excludedMenuIds: string[]
  preferredCategories: Category[]
  avoidanceWindowDays: number
  theme: Theme
  locationEnabled: boolean
  notificationsEnabled: boolean
  reelAutoGenerate: ReelAutoGenerate
  premium: boolean
  onboardingCompleted: boolean
}
