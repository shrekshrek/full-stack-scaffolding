from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from jose import JWTError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
import uuid
import json
from datetime import datetime
from ..core.config import settings

# 配置JSON格式的日志
logger = logging.getLogger("app")

class AppHTTPException(StarletteHTTPException):
    """应用程序HTTP异常，支持额外的字段"""
    def __init__(self, status_code: int, detail: str = None, headers: dict = None, code: str = None):
        self.code = code
        super().__init__(status_code=status_code, detail=detail, headers=headers)

def get_request_id(request: Request) -> str:
    """获取请求ID，如果没有则生成一个"""
    if hasattr(request.state, "request_id"):
        return request.state.request_id
    return str(uuid.uuid4())

class JSONLogFormatter(logging.Formatter):
    """自定义JSON格式的日志格式化器"""
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        
        if hasattr(record, "exception"):
            log_data["exception"] = record.exception
        
        return json.dumps(log_data)

def setup_logging():
    """配置日志系统"""
    # 创建日志处理器
    handler = logging.StreamHandler()
    handler.setFormatter(JSONLogFormatter())
    
    # 配置根日志记录器
    logging.root.handlers = [handler]
    logging.root.setLevel(logging.INFO)
    
    # 配置应用日志记录器
    logger.handlers = [handler]
    logger.setLevel(logging.INFO)
    logger.propagate = False

async def request_id_middleware(request: Request, call_next):
    """中间件：为每个请求添加一个唯一的请求ID"""
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    
    return response

async def db_exception_handler(request: Request, exc: SQLAlchemyError):
    """处理SQLAlchemy异常"""
    request_id = get_request_id(request)
    
    logger.error(
        f"数据库错误: {str(exc)}",
        extra={"request_id": request_id, "exception": str(exc)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "数据库操作错误",
            "request_id": request_id
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """处理请求验证异常"""
    request_id = get_request_id(request)
    
    errors = []
    for error in exc.errors():
        errors.append({
            "loc": error.get("loc", []),
            "msg": error.get("msg", ""),
            "type": error.get("type", "")
        })
    
    logger.warning(
        f"请求验证错误: {str(exc)}",
        extra={"request_id": request_id, "exception": jsonable_encoder(errors)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "请求参数验证失败",
            "errors": jsonable_encoder(errors),
            "request_id": request_id
        },
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """处理HTTP异常"""
    request_id = get_request_id(request)
    
    # 记录4xx以上的错误
    if exc.status_code >= 400:
        logger.warning(
            f"HTTP错误: {exc.detail}",
            extra={"request_id": request_id, "exception": exc.detail}
        )
    
    content = {"detail": exc.detail, "request_id": request_id}
    
    # 如果是自定义HTTP异常，添加错误代码
    if isinstance(exc, AppHTTPException) and exc.code:
        content["code"] = exc.code
    
    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        headers=exc.headers,
    )

async def jwt_exception_handler(request: Request, exc: JWTError):
    """处理JWT异常"""
    request_id = get_request_id(request)
    
    logger.warning(
        f"JWT验证错误: {str(exc)}",
        extra={"request_id": request_id, "exception": str(exc)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "detail": "无效的认证凭据",
            "request_id": request_id
        },
        headers={"WWW-Authenticate": "Bearer"},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """处理所有其他异常"""
    request_id = get_request_id(request)
    
    logger.error(
        f"未处理的异常: {str(exc)}",
        extra={"request_id": request_id, "exception": str(exc)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "服务器内部错误",
            "request_id": request_id
        },
    ) 