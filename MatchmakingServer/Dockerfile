FROM node:22 as ts-compiler

# 앱 디렉터리 생성
WORKDIR /usr/src/match-server

# 환경 변수 설정
ENV NODE_ENV=development
ENV SPECIFIC_ENV=local-k8s

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install
RUN npx prisma generate
# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

# 앱 소스 추가
COPY . .

RUN npm run build

# 기본 포트 EXPOSE (실제 사용 포트는 런타임에 결정될 수 있음)
EXPOSE 80
CMD ["node", "dist/main.js"]