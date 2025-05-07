# 构建阶段：第一阶段 - 依赖安装
FROM node:16-alpine AS dependencies

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 仅复制package.json和锁文件，优化缓存
COPY package.json pnpm-lock.yaml .npmrc* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建阶段：第二阶段 - 构建应用
FROM node:16-alpine AS builder

WORKDIR /app

# 从依赖阶段复制node_modules
COPY --from=dependencies /app/node_modules ./node_modules

# 复制所有源文件
COPY . .

# 设置构建环境变量（可以在构建时传入不同的值）
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_APP_ENV=production
ARG VITE_APP_TITLE="FastAPI + Vue3全栈应用"

# 设置环境变量
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}

# 构建应用
RUN pnpm build

# 生产阶段：最终阶段 - 运行nginx
FROM nginx:stable-alpine AS production

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 复制构建输出到nginx目录
COPY --from=builder /app/dist .

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 支持运行时注入环境变量的脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"] 