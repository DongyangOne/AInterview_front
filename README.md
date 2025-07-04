# AInterview_front

2025 one 엑스포 프론트

## 프로젝트 시작 방법

1. git clone 이후
   -> npm install / npm i

2. 프로젝트 실행
   -> npm run android

   \*안드로이드 애뮬레이터 사용 시 a -> 애뮬레이터 실행됨.

## 프로젝트 구조

```
AInterview_front/
├── app/
│ ├── (tabs)/ # 하단 탭 네비게이션 관련 화면
│ │ ├── \_layout.tsx # 탭 네비게이션 레이아웃
│ ├── screens/ # 로그인 등 독립된 화면 구성
│ │ └── Login.tsx
│ └── \_layout.tsx # 앱 전체의 스택 레이아웃 설정
│
├── assets/
│ ├── fonts/ # 커스텀 폰트 저장 폴더
│ ├── images/ # 이미지 파일 저장 폴더
│ └── icons/ # 아이콘 파일 저장 폴더 (※ 현재 미생성)
│
├── components/ # 공통 UI 컴포넌트 모음
│
│
├── constants/ # 공통으로 사용하는 색상, 폰트 등의 상수 설정
│ └── Colors.ts
│
│
├── app.json # Expo 앱 구성 설정
├── package.json # 프로젝트 의존성 및 스크립트
├── package-lock.json
├── tsconfig.json # TypeScript 컴파일 설정
├── .gitignore # Git 추적 제외 파일 목록
└── README.md # 프로젝트 설명 파일
```

## 파일명 지정 방법

- 파일명은 기능 및 페이지가 잘 드러날 수 있도록 하며, 너무 길지 않게 작성
- 길어질 경우 문자가 끝나는 사이에 대문자 삽입 \* ex) mypage -> myPage
