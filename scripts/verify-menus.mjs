// 메뉴 데이터 검증 스크립트
// 사용: node scripts/verify-menus.mjs

import { readFileSync } from 'node:fs'

const file = readFileSync(new URL('../src/data/menus.ts', import.meta.url), 'utf-8')

// 간단한 정규식 파싱 (테스트용)
const idMatches = [...file.matchAll(/id: '([^']+)'/g)]
const nameMatches = [...file.matchAll(/name: '([^']+)'/g)]
const categoryMatches = [...file.matchAll(/category: '([^']+)'/g)]

const count = idMatches.length

// fitness 범위 위반 검사
const fitnessLines = [...file.matchAll(/(breakfast|brunch|lunch|dinner|latenight|weekday|weekend|cold|hot|rainy): ([\d.]+)/g)]
const violations = fitnessLines
  .map(([, key, val]) => ({ key, val: parseFloat(val) }))
  .filter(({ val }) => val < 0.5 || val > 2.0)

// 카테고리 분포
const catCounts = {}
for (const [, cat] of categoryMatches) {
  catCounts[cat] = (catCounts[cat] || 0) + 1
}

// 시간대별 적합 (fitness >= 1.3) 메뉴 수 — 라인 단위로 파싱
const menuBlocks = file.split(/\{\s*\n\s*id:/).slice(1)
const timeFit = { breakfast: 0, brunch: 0, lunch: 0, dinner: 0, latenight: 0 }
for (const block of menuBlocks) {
  for (const t of Object.keys(timeFit)) {
    const m = block.match(new RegExp(`${t}:\\s*([\\d.]+)`))
    if (m && parseFloat(m[1]) >= 1.3) timeFit[t]++
  }
}

// id 중복 검사
const idSet = new Set()
const dupIds = []
for (const [, id] of idMatches) {
  if (idSet.has(id)) dupIds.push(id)
  idSet.add(id)
}

console.log('═══════════════════════════════════════════════')
console.log('  메뉴 데이터 검증 결과')
console.log('═══════════════════════════════════════════════')
console.log(`총 메뉴 수: ${count}개  ${count >= 80 && count <= 100 ? '✓' : '✗ (목표 80~100)'}`)
console.log()
console.log('카테고리 분포:')
const targets = { '한식': [25,32], '일식': [10,12], '중식': [8,10], '양식': [12,15], '분식': [8,10], '아시안': [5,7], '기타': [5,8] }
for (const [cat, [min, max]] of Object.entries(targets)) {
  const n = catCounts[cat] || 0
  const ok = n >= min && n <= max
  console.log(`  ${cat.padEnd(4)}: ${String(n).padStart(2)}  목표 ${min}~${max}  ${ok ? '✓' : '✗'}`)
}
console.log()
console.log('시간대 적합 메뉴 수 (fitness ≥ 1.3):')
const timeTargets = { breakfast: 15, brunch: 15, lunch: 50, dinner: 50, latenight: 20 }
for (const [t, target] of Object.entries(timeTargets)) {
  const n = timeFit[t]
  console.log(`  ${t.padEnd(10)}: ${String(n).padStart(2)}  목표 ${target}+  ${n >= target ? '✓' : '✗'}`)
}
console.log()
console.log(`가중치 범위 위반 (0.5~2.0): ${violations.length}건  ${violations.length === 0 ? '✓' : '✗'}`)
if (violations.length > 0) {
  for (const v of violations.slice(0, 10)) {
    console.log(`  ${v.key}=${v.val}`)
  }
}
console.log()
console.log(`id 중복: ${dupIds.length}건  ${dupIds.length === 0 ? '✓' : '✗'}`)
if (dupIds.length > 0) console.log(`  중복: ${dupIds.join(', ')}`)
console.log('═══════════════════════════════════════════════')
