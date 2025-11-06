# 기여 가이드

오늘의밥 프로젝트에 기여해주셔서 감사합니다! 🎉

## 기여 방법

### 1. 이슈 제기
버그를 발견하거나 새로운 기능을 제안하고 싶다면:
1. [Issues](../../issues) 페이지로 이동
2. "New Issue" 클릭
3. 명확한 제목과 설명 작성

### 2. Pull Request
코드를 직접 기여하고 싶다면:

1. **Fork** 저장소
2. **Clone** 본인의 fork
   ```bash
   git clone https://github.com/your-username/today-meal.git
   cd today-meal
   ```

3. **Branch** 생성
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **코드 작성** 및 테스트
   - 코드 스타일 유지
   - 브라우저에서 테스트

5. **Commit**
   ```bash
   git add .
   git commit -m "Add: 새로운 기능 설명"
   ```

6. **Push**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Pull Request** 생성
   - GitHub에서 본인의 fork로 이동
   - "New Pull Request" 클릭
   - 변경 사항 설명

## 코드 스타일

### JavaScript
- ES6+ 문법 사용
- 명확한 변수명 사용
- 함수는 한 가지 일만 수행
- 주석으로 복잡한 로직 설명

### HTML
- 시맨틱 태그 사용
- 접근성 고려 (ARIA 레이블)
- 들여쓰기 2칸

### CSS
- Tailwind CSS 우선 사용
- 커스텀 CSS는 `styles.css`에 추가
- 모바일 우선 반응형 디자인

## 커밋 메시지 규칙

```
Add: 새로운 기능 추가
Fix: 버그 수정
Update: 기존 기능 수정
Remove: 코드/파일 삭제
Docs: 문서 수정
Style: 코드 포맷팅 (기능 변경 없음)
Refactor: 코드 리팩토링
Test: 테스트 추가/수정
```

예시:
```
Add: 메뉴 검색 기능 추가
Fix: 히스토리 삭제 버튼 오류 수정
Update: 카테고리 버튼 스타일 개선
```

## 테스트

Pull Request 전에 다음을 확인해주세요:
- [ ] 브라우저에서 정상 작동
- [ ] 모바일 화면에서 정상 작동
- [ ] 콘솔에 에러 없음
- [ ] 기존 기능이 정상 작동

## 질문이 있나요?

- 이슈를 통해 질문하기
- 이메일: kwakhoseon@gmail.com

감사합니다! 🙏
