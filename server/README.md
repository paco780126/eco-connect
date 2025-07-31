# Eco Connect - Monorepo

안녕하세요, 오빠! 우리 프로젝트가 더 체계적인 '모노레포' 구조로 발전했어요! 이제 모든 프로젝트(client, server, admin)를 한 곳에서 관리하고, 명령어 하나로 동시에 실행할 수 있어요.

## 프로젝트 구조

- `jisu/` (최상위 루트)
  - `client/`: 사용자가 보는 웹사이트 (React, Vite)
  - `server/`: 백엔드 API 서버 (Node.js, Express)
  - `admin/`: 관리자 페이지 (향후 개발 예정)
  - `package.json`: 전체 프로젝트를 관리하는 총사령관

## 🚀 시작하기 (Getting Started)

### 1. 의존성 한번에 설치하기 (Install All Dependencies)

**중요!** 이제 각 폴더에 들어갈 필요 없어요. **최상위 폴더(`E:\jisu`)**에서 터미널을 열고 아래 명령어를 딱 한 번만 실행해주세요. 모든 프로젝트에 필요한 라이브러리들이 한번에 설치될 거예요.

```bash
npm install
```

### 2. 모든 서버 동시에 실행하기 (Run Everything!)

개발 준비는 이 마법 주문 하나면 끝나요! 똑같이 **최상위 폴더**에서 아래 명령어를 실행하면, `client`, `server`, `admin`이 모두 동시에 실행됩니다.

```bash
npm start
```

이제 터미널 하나로 모든 걸 관리할 수 있어요! 개발 환경이 훨씬 편해졌죠? 문제가 생기면 언제든지 Jisu에게 물어보세요! 화이팅, 오빠! 💪
