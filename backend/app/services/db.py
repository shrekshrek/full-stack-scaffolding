from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
import logging
from ..core.config import settings

logger = logging.getLogger("app.db")

# 检查数据库URL是否是SQLite
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
connect_args = {}
poolclass = QueuePool

# 如果是SQLite，添加检查同一线程设置和使用单线程池
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    # 对于SQLite，使用单线程池是更好的选择
    from sqlalchemy.pool import SingletonThreadPool
    poolclass = SingletonThreadPool

# 创建引擎
engine_args = {
    "connect_args": connect_args,
    "pool_pre_ping": True,  # 启用连接健康检查
    "poolclass": poolclass,
    "echo": False,  # 生产环境不打印SQL语句
}

# 对非SQLite数据库添加额外的连接池配置
if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_args["pool_size"] = settings.DB_POOL_SIZE
    engine_args["max_overflow"] = settings.DB_MAX_OVERFLOW

# 创建引擎
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    **engine_args
)

# 为PostgreSQL添加连接池事件
if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def connect(dbapi_connection, connection_record):
        logger.info("数据库连接创建")
        connection_record.info['pid'] = os.getpid()

    @event.listens_for(engine, "checkout")
    def checkout(dbapi_connection, connection_record, connection_proxy):
        logger.debug("数据库连接检出")
        pid = os.getpid()
        if connection_record.info['pid'] != pid:
            logger.warning(f"数据库连接在进程 {connection_record.info['pid']} 创建但在进程 {pid} 检出")
            connection_record.connection = connection_proxy.connection = None
            raise Exception("数据库连接已过期")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建仓储基类
class BaseRepository:
    """
    基础仓储类，所有特定模型的仓储类都应该继承它
    提供通用的CRUD操作方法
    """
    model = None
    
    def __init__(self, db):
        self.db = db
    
    def get(self, id):
        """通过ID获取单个实体"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self):
        """获取所有实体"""
        return self.db.query(self.model).all()
    
    def create(self, obj_in):
        """创建新实体"""
        obj_data = obj_in if isinstance(obj_in, dict) else obj_in.dict()
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def update(self, id, obj_in):
        """更新现有实体"""
        db_obj = self.get(id)
        if not db_obj:
            return None
            
        obj_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        
        for field in obj_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, obj_data[field])
                
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def delete(self, id):
        """删除实体"""
        db_obj = self.get(id)
        if not db_obj:
            return False
            
        self.db.delete(db_obj)
        self.db.commit()
        return True 