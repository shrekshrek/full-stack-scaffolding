from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from jose import JWTError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles
import os
import time

from .api.v1.router import api_router
from .core.config import settings
from .core.exceptions import (
    setup_logging, request_id_middleware, db_exception_handler,
    validation_exception_handler, http_exception_handler,
    jwt_exception_handler, generic_exception_handler
)
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

# 配置日志
setup_logging()

# 创建速率限制器
limiter = Limiter(key_func=get_remote_address)

# 创建应用
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="具有现代化安全特性的FastAPI应用",
    version="1.0.0",
    docs_url=None,  # 禁用默认的/docs路径
    redoc_url=None,  # 禁用默认的/redoc路径
    openapi_tags=[
        {
            "name": "认证",
            "description": "用户认证相关操作，包括登录和令牌刷新",
        },
        {
            "name": "用户",
            "description": "用户管理相关操作",
        },
        {
            "name": "Todo",
            "description": "待办事项管理",
        },
    ],
    contact={
        "name": "技术支持",
        "url": "https://example.com/support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,  # 默认收起模型
        "deepLinking": True,  # 允许链接到特定操作
        "displayRequestDuration": True,  # 显示请求持续时间
        "filter": True,  # 启用过滤
    },
)

# 配置静态文件目录
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 配置异常处理器
app.add_exception_handler(SQLAlchemyError, db_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(JWTError, jwt_exception_handler)
app.add_exception_handler(RateLimitExceeded, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# 配置中间件
@app.middleware("http")
async def add_request_id_middleware(request: Request, call_next):
    return await request_id_middleware(request, call_next)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """记录所有请求的中间件"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# 添加限速中间件
app.state.limiter = limiter  # 将limiter分配给app.state
app.add_middleware(SlowAPIMiddleware)

# 配置CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# 注册API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

# 自定义API文档路径
@app.get("/api/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """自定义Swagger UI文档路径"""
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title=f"{settings.PROJECT_NAME} - API文档",
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )

@app.get("/api/redoc", include_in_schema=False)
async def custom_redoc_html():
    """自定义ReDoc文档路径"""
    return get_redoc_html(
        openapi_url="/openapi.json",
        title=f"{settings.PROJECT_NAME} - API文档(ReDoc)",
        redoc_js_url="/static/redoc.standalone.js",
    )

# 确保OpenAPI JSON端点可访问
@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_json():
    return app.openapi()

# 健康检查端点
@app.get("/health")
def health_check():
    """系统健康检查"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 