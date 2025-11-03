-- ============================================
-- GoAbroad 出国助手数据库 DDL (PostgreSQL版本)
-- 数据库版本: PostgreSQL 14+
-- 创建时间: 2024-10-25
-- ============================================

-- 创建数据库（如果需要）
-- CREATE DATABASE goabroad_db WITH ENCODING 'UTF8' LC_COLLATE='zh_CN.UTF-8' LC_CTYPE='zh_CN.UTF-8' TEMPLATE=template0;

-- 连接到数据库
-- \c goabroad_db;
--
-- -- 设置时区
-- SET timezone = 'Asia/Shanghai';

-- ============================================
-- 创建更新时间触发器函数
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. 国家信息表
-- ============================================
CREATE TABLE countries (
    id BIGSERIAL PRIMARY KEY,
    code CHAR(2) NOT NULL UNIQUE,
    name_zh VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    flag_emoji VARCHAR(10),
    overview JSONB,
    study_info JSONB,
    work_info JSONB,
    immigration_info JSONB,
    living_info JSONB,
    avg_tuition_min DECIMAL(10, 2),
    avg_tuition_max DECIMAL(10, 2),
    avg_living_cost DECIMAL(10, 2),
    difficulty_rating SMALLINT DEFAULT 5,
    popularity_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    plan_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_countries_is_active ON countries(is_active);
CREATE INDEX idx_countries_sort_popularity ON countries(sort_order, popularity_score);

COMMENT ON TABLE countries IS '国家信息表';
COMMENT ON COLUMN countries.code IS '国家代码 ISO 3166-1 alpha-2 (US/UK/CA)';
COMMENT ON COLUMN countries.name_zh IS '中文名称';
COMMENT ON COLUMN countries.name_en IS '英文名称';
COMMENT ON COLUMN countries.flag_emoji IS '国旗emoji 🇺🇸';
COMMENT ON COLUMN countries.overview IS '国家概览：{"description":"...","advantages":[],"disadvantages":[]}';
COMMENT ON COLUMN countries.study_info IS '留学信息：{"education_system":"...","application_process":[],"requirements":{}}';
COMMENT ON COLUMN countries.work_info IS '工作信息：{"visa_types":[],"job_market":"...","salary_range":{}}';
COMMENT ON COLUMN countries.immigration_info IS '移民信息：{"types":[],"requirements":{},"timeline":"..."}';
COMMENT ON COLUMN countries.living_info IS '生活信息：{"climate":"...","cost_of_living":{},"safety_index":8}';
COMMENT ON COLUMN countries.avg_tuition_min IS '学费最低（年，单位：人民币）';
COMMENT ON COLUMN countries.avg_tuition_max IS '学费最高（年）';
COMMENT ON COLUMN countries.avg_living_cost IS '平均生活费（年）';
COMMENT ON COLUMN countries.difficulty_rating IS '申请难度 1-10';
COMMENT ON COLUMN countries.popularity_score IS '热度分数';
COMMENT ON COLUMN countries.is_active IS '是否启用';
COMMENT ON COLUMN countries.is_featured IS '是否推荐';
COMMENT ON COLUMN countries.sort_order IS '排序权重';
COMMENT ON COLUMN countries.plan_count IS '规划数量';
COMMENT ON COLUMN countries.view_count IS '浏览次数';

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. 国家政策更新表
-- ============================================
CREATE TABLE country_policies (
    id BIGSERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    policy_type VARCHAR(20) DEFAULT 'VISA' CHECK (policy_type IN ('VISA', 'IMMIGRATION', 'WORK', 'STUDY')),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    effective_date DATE,
    source_url VARCHAR(500),
    is_important BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_country_policies_country FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE
);

CREATE INDEX idx_country_policies_country_type ON country_policies(country_code, policy_type);
CREATE INDEX idx_country_policies_deleted ON country_policies(deleted);
CREATE INDEX idx_country_policies_effective_date ON country_policies(effective_date);

COMMENT ON TABLE country_policies IS '国家政策更新';
COMMENT ON COLUMN country_policies.country_code IS '国家代码';
COMMENT ON COLUMN country_policies.title IS '政策标题';
COMMENT ON COLUMN country_policies.content IS '政策内容（Markdown）';
COMMENT ON COLUMN country_policies.effective_date IS '生效日期';
COMMENT ON COLUMN country_policies.source_url IS '来源链接';
COMMENT ON COLUMN country_policies.is_important IS '是否重要更新';
COMMENT ON COLUMN country_policies.deleted IS '逻辑删除标记';
COMMENT ON COLUMN country_policies.version_id IS '乐观锁版本号';

CREATE TRIGGER update_country_policies_updated_at BEFORE UPDATE ON country_policies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 系统配置表
-- ============================================
CREATE TABLE system_configs (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    value_type VARCHAR(20) DEFAULT 'STRING' CHECK (value_type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
    description VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0
);

CREATE INDEX idx_system_configs_deleted ON system_configs(deleted);

COMMENT ON TABLE system_configs IS '系统配置表';
COMMENT ON COLUMN system_configs.config_key IS '配置键';
COMMENT ON COLUMN system_configs.config_value IS '配置值';
COMMENT ON COLUMN system_configs.description IS '配置说明';
COMMENT ON COLUMN system_configs.is_public IS '是否公开（前端可访问）';
COMMENT ON COLUMN system_configs.deleted IS '逻辑删除标记';
COMMENT ON COLUMN system_configs.version_id IS '乐观锁版本号';

CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON system_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. 标签字典表
-- ============================================
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    color VARCHAR(20),
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0
);

CREATE INDEX idx_tags_deleted ON tags(deleted);
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);

COMMENT ON TABLE tags IS '标签字典表';
COMMENT ON COLUMN tags.name IS '标签名称';
COMMENT ON COLUMN tags.slug IS 'URL友好标识';
COMMENT ON COLUMN tags.description IS '标签描述';
COMMENT ON COLUMN tags.color IS '标签颜色（HEX）';
COMMENT ON COLUMN tags.post_count IS '帖子数（冗余）';
COMMENT ON COLUMN tags.deleted IS '逻辑删除标记';
COMMENT ON COLUMN tags.version_id IS '乐观锁版本号';

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 用户主表
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    bio VARCHAR(500),
    gender VARCHAR(30) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    birth_date DATE,
    location VARCHAR(100),
    post_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'BANNED', 'DELETED')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0
);

CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted ON users(deleted);
CREATE INDEX idx_users_status ON users(status);

COMMENT ON TABLE users IS '用户主表';
COMMENT ON COLUMN users.id IS '用户ID';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.email IS '邮箱（唯一，可选）';
COMMENT ON COLUMN users.phone IS '手机号';
COMMENT ON COLUMN users.password_hash IS '密码哈希（bcrypt）';
COMMENT ON COLUMN users.nickname IS '昵称';
COMMENT ON COLUMN users.avatar_url IS '头像URL';
COMMENT ON COLUMN users.bio IS '个人简介';
COMMENT ON COLUMN users.birth_date IS '出生日期';
COMMENT ON COLUMN users.location IS '所在地';
COMMENT ON COLUMN users.post_count IS '发帖数';
COMMENT ON COLUMN users.follower_count IS '粉丝数';
COMMENT ON COLUMN users.following_count IS '关注数';
COMMENT ON COLUMN users.email_verified IS '邮箱是否验证';
COMMENT ON COLUMN users.phone_verified IS '手机是否验证';
COMMENT ON COLUMN users.last_login_at IS '最后登录时间';
COMMENT ON COLUMN users.last_login_ip IS '最后登录IP';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';
COMMENT ON COLUMN users.deleted IS '逻辑删除标记 false=未删除 true=已删除';
COMMENT ON COLUMN users.version_id IS '乐观锁版本号';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. 费用计算记录表
-- ============================================
CREATE TABLE cost_calculations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    country_code CHAR(2) NOT NULL,
    input_params JSONB NOT NULL,
    result JSONB NOT NULL,
    scheme_name VARCHAR(100),
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_cost_calculations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_cost_calculations_country_code ON cost_calculations(country_code);
CREATE INDEX idx_cost_calculations_deleted ON cost_calculations(deleted);
CREATE INDEX idx_cost_calculations_user_id ON cost_calculations(user_id);

COMMENT ON TABLE cost_calculations IS '费用计算记录';
COMMENT ON COLUMN cost_calculations.user_id IS '用户ID（可为空，游客也可用）';
COMMENT ON COLUMN cost_calculations.country_code IS '国家代码';
COMMENT ON COLUMN cost_calculations.input_params IS '输入参数：{"school_type":"public","region":"west_coast","tuition":40000}';
COMMENT ON COLUMN cost_calculations.result IS '结果：{"total_per_year":77500,"breakdown":{...}}';
COMMENT ON COLUMN cost_calculations.scheme_name IS '方案名称（用户自定义）';
COMMENT ON COLUMN cost_calculations.is_saved IS '是否保存';
COMMENT ON COLUMN cost_calculations.deleted IS '逻辑删除标记';
COMMENT ON COLUMN cost_calculations.version_id IS '乐观锁版本号';

-- ============================================
-- 7. GPA转换记录表
-- ============================================
CREATE TABLE gpa_conversions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    from_system VARCHAR(50) NOT NULL,
    to_system VARCHAR(50) NOT NULL,
    input_value DECIMAL(5, 2) NOT NULL,
    output_value DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_gpa_conversions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_gpa_conversions_deleted ON gpa_conversions(deleted);
CREATE INDEX idx_gpa_conversions_user_id ON gpa_conversions(user_id);

COMMENT ON TABLE gpa_conversions IS 'GPA转换记录';
COMMENT ON COLUMN gpa_conversions.user_id IS '用户ID';
COMMENT ON COLUMN gpa_conversions.from_system IS '源系统（china_4.0/china_100/uk等）';
COMMENT ON COLUMN gpa_conversions.to_system IS '目标系统';
COMMENT ON COLUMN gpa_conversions.input_value IS '输入值';
COMMENT ON COLUMN gpa_conversions.output_value IS '输出值';
COMMENT ON COLUMN gpa_conversions.deleted IS '逻辑删除标记';
COMMENT ON COLUMN gpa_conversions.version_id IS '乐观锁版本号';

-- ============================================
-- 8. 系统通知表
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sender_id BIGINT,
    type VARCHAR(20) DEFAULT 'SYSTEM' CHECK (type IN ('SYSTEM', 'LIKE', 'COMMENT', 'FOLLOW', 'REPLY', 'MENTION', 'POLICY_UPDATE')),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    related_type VARCHAR(50),
    related_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_deleted ON notifications(deleted);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);

COMMENT ON TABLE notifications IS '系统通知表';
COMMENT ON COLUMN notifications.user_id IS '接收者ID';
COMMENT ON COLUMN notifications.sender_id IS '发送者ID（系统通知为NULL）';
COMMENT ON COLUMN notifications.title IS '通知标题';
COMMENT ON COLUMN notifications.content IS '通知内容';
COMMENT ON COLUMN notifications.related_type IS '关联对象类型（post/comment/plan）';
COMMENT ON COLUMN notifications.related_id IS '关联对象ID';
COMMENT ON COLUMN notifications.is_read IS '是否已读';
COMMENT ON COLUMN notifications.read_at IS '阅读时间';
COMMENT ON COLUMN notifications.deleted IS '逻辑删除标记';
COMMENT ON COLUMN notifications.version_id IS '乐观锁版本号';

-- ============================================
-- 9. 用户规划表
-- ============================================
CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    country_code CHAR(2) NOT NULL,
    plan_type VARCHAR(20) DEFAULT 'STUDY' CHECK (plan_type IN ('STUDY', 'WORK', 'IMMIGRATION')),
    sub_type VARCHAR(50),
    target_date DATE,
    title VARCHAR(200),
    current_status JSONB,
    progress SMALLINT DEFAULT 0,
    current_stage VARCHAR(50),
    total_stages SMALLINT DEFAULT 0,
    completed_stages SMALLINT DEFAULT 0,
    total_tasks SMALLINT DEFAULT 0,
    completed_tasks SMALLINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_plans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_plans_country FOREIGN KEY (country_code) REFERENCES countries(code)
);

CREATE INDEX idx_plans_country_code ON plans(country_code);
CREATE INDEX idx_plans_deleted ON plans(deleted);
CREATE INDEX idx_plans_plan_type ON plans(plan_type);
CREATE INDEX idx_plans_status ON plans(status);
CREATE INDEX idx_plans_user_id ON plans(user_id);

COMMENT ON TABLE plans IS '用户规划表';
COMMENT ON COLUMN plans.user_id IS '用户ID';
COMMENT ON COLUMN plans.country_code IS '目标国家';
COMMENT ON COLUMN plans.sub_type IS '细分类型（bachelor/master/phd/work_visa等）';
COMMENT ON COLUMN plans.target_date IS '计划出发日期';
COMMENT ON COLUMN plans.title IS '规划标题（如"2026年美国CS硕士申请"）';
COMMENT ON COLUMN plans.current_status IS '用户当前状态：{"education":"bachelor","gpa":3.5,"toefl":100}';
COMMENT ON COLUMN plans.progress IS '整体进度 0-100';
COMMENT ON COLUMN plans.current_stage IS '当前所处阶段名称';
COMMENT ON COLUMN plans.total_stages IS '总阶段数';
COMMENT ON COLUMN plans.completed_stages IS '已完成阶段数';
COMMENT ON COLUMN plans.total_tasks IS '总任务数';
COMMENT ON COLUMN plans.completed_tasks IS '已完成任务数';
COMMENT ON COLUMN plans.completed_at IS '完成时间';
COMMENT ON COLUMN plans.deleted IS '逻辑删除标记';
COMMENT ON COLUMN plans.version_id IS '乐观锁版本号';

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. 材料清单表
-- ============================================
CREATE TABLE material_checklists (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    material_name VARCHAR(200) NOT NULL,
    category VARCHAR(20) DEFAULT 'REQUIRED' CHECK (category IN ('REQUIRED', 'SUPPORTING', 'OPTIONAL')),
    description TEXT,
    requirements TEXT,
    example_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'SKIPPED')),
    reminder_date DATE,
    due_date DATE,
    file_count SMALLINT DEFAULT 0,
    sort_order SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_material_checklists_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

CREATE INDEX idx_material_checklists_category ON material_checklists(category);
CREATE INDEX idx_material_checklists_deleted ON material_checklists(deleted);
CREATE INDEX idx_material_checklists_plan_id ON material_checklists(plan_id);
CREATE INDEX idx_material_checklists_status ON material_checklists(status);

COMMENT ON TABLE material_checklists IS '材料清单表';
COMMENT ON COLUMN material_checklists.plan_id IS '规划ID';
COMMENT ON COLUMN material_checklists.material_name IS '材料名称';
COMMENT ON COLUMN material_checklists.description IS '材料说明';
COMMENT ON COLUMN material_checklists.requirements IS '要求细节（格式、份数等）';
COMMENT ON COLUMN material_checklists.example_url IS '示例文件URL';
COMMENT ON COLUMN material_checklists.reminder_date IS '提醒日期';
COMMENT ON COLUMN material_checklists.due_date IS '截止日期';
COMMENT ON COLUMN material_checklists.file_count IS '已上传文件数';
COMMENT ON COLUMN material_checklists.sort_order IS '排序';
COMMENT ON COLUMN material_checklists.completed_at IS '完成时间';
COMMENT ON COLUMN material_checklists.deleted IS '逻辑删除标记';
COMMENT ON COLUMN material_checklists.version_id IS '乐观锁版本号';

CREATE TRIGGER update_material_checklists_updated_at BEFORE UPDATE ON material_checklists
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. 材料文件记录表
-- ============================================
CREATE TABLE material_files (
    id BIGSERIAL PRIMARY KEY,
    checklist_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_material_files_checklist FOREIGN KEY (checklist_id) REFERENCES material_checklists(id) ON DELETE CASCADE,
    CONSTRAINT fk_material_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_material_files_checklist_id ON material_files(checklist_id);
CREATE INDEX idx_material_files_deleted ON material_files(deleted);
CREATE INDEX idx_material_files_user_id ON material_files(user_id);

COMMENT ON TABLE material_files IS '材料文件记录';
COMMENT ON COLUMN material_files.checklist_id IS '材料清单ID';
COMMENT ON COLUMN material_files.user_id IS '用户ID';
COMMENT ON COLUMN material_files.file_name IS '文件名';
COMMENT ON COLUMN material_files.file_url IS '文件URL（OSS）';
COMMENT ON COLUMN material_files.file_type IS '文件类型（pdf/jpg/png）';
COMMENT ON COLUMN material_files.file_size IS '文件大小（字节）';
COMMENT ON COLUMN material_files.uploaded_at IS '上传时间';
COMMENT ON COLUMN material_files.deleted IS '逻辑删除标记';
COMMENT ON COLUMN material_files.version_id IS '乐观锁版本号';

-- ============================================
-- 12. 规划里程碑表
-- ============================================
CREATE TABLE plan_milestones (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    milestone_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'MISSED')),
    sort_order SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_plan_milestones_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

CREATE INDEX idx_plan_milestones_deleted ON plan_milestones(deleted);
CREATE INDEX idx_plan_milestones_milestone_date ON plan_milestones(milestone_date);
CREATE INDEX idx_plan_milestones_plan_id ON plan_milestones(plan_id);

COMMENT ON TABLE plan_milestones IS '规划里程碑表';
COMMENT ON COLUMN plan_milestones.plan_id IS '规划ID';
COMMENT ON COLUMN plan_milestones.name IS '里程碑名称';
COMMENT ON COLUMN plan_milestones.description IS '说明';
COMMENT ON COLUMN plan_milestones.icon IS '图标名称';
COMMENT ON COLUMN plan_milestones.milestone_date IS '里程碑日期';
COMMENT ON COLUMN plan_milestones.sort_order IS '排序';
COMMENT ON COLUMN plan_milestones.completed_at IS '完成时间';
COMMENT ON COLUMN plan_milestones.deleted IS '逻辑删除标记';
COMMENT ON COLUMN plan_milestones.version_id IS '乐观锁版本号';

CREATE TRIGGER update_plan_milestones_updated_at BEFORE UPDATE ON plan_milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 13. 规划阶段表
-- ============================================
CREATE TABLE plan_stages (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    duration_days SMALLINT,
    status VARCHAR(20) DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    progress SMALLINT DEFAULT 0,
    total_tasks SMALLINT DEFAULT 0,
    completed_tasks SMALLINT DEFAULT 0,
    sort_order SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_plan_stages_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

CREATE INDEX idx_plan_stages_deleted ON plan_stages(deleted);
CREATE INDEX idx_plan_stages_plan_id ON plan_stages(plan_id);
CREATE INDEX idx_plan_stages_sort_order ON plan_stages(sort_order);
CREATE INDEX idx_plan_stages_status ON plan_stages(status);

COMMENT ON TABLE plan_stages IS '规划阶段表';
COMMENT ON COLUMN plan_stages.plan_id IS '规划ID';
COMMENT ON COLUMN plan_stages.name IS '阶段名称（如"语言考试阶段"）';
COMMENT ON COLUMN plan_stages.description IS '阶段描述';
COMMENT ON COLUMN plan_stages.start_date IS '开始日期';
COMMENT ON COLUMN plan_stages.end_date IS '结束日期';
COMMENT ON COLUMN plan_stages.duration_days IS '预计天数';
COMMENT ON COLUMN plan_stages.progress IS '阶段进度 0-100';
COMMENT ON COLUMN plan_stages.total_tasks IS '任务总数';
COMMENT ON COLUMN plan_stages.completed_tasks IS '已完成任务数';
COMMENT ON COLUMN plan_stages.sort_order IS '排序顺序';
COMMENT ON COLUMN plan_stages.completed_at IS '完成时间';
COMMENT ON COLUMN plan_stages.deleted IS '逻辑删除标记';
COMMENT ON COLUMN plan_stages.version_id IS '乐观锁版本号';

CREATE TRIGGER update_plan_stages_updated_at BEFORE UPDATE ON plan_stages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 14. 规划任务表
-- ============================================
CREATE TABLE plan_tasks (
    id BIGSERIAL PRIMARY KEY,
    stage_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE,
    reminder_date DATE,
    status VARCHAR(20) DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'SKIPPED')),
    guide_url VARCHAR(500),
    related_tool VARCHAR(50),
    sort_order SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_plan_tasks_stage FOREIGN KEY (stage_id) REFERENCES plan_stages(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_tasks_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

CREATE INDEX idx_plan_tasks_deleted ON plan_tasks(deleted);
CREATE INDEX idx_plan_tasks_due_date ON plan_tasks(due_date);
CREATE INDEX idx_plan_tasks_plan_id ON plan_tasks(plan_id);
CREATE INDEX idx_plan_tasks_stage_id ON plan_tasks(stage_id);
CREATE INDEX idx_plan_tasks_status ON plan_tasks(status);

COMMENT ON TABLE plan_tasks IS '规划任务表';
COMMENT ON COLUMN plan_tasks.stage_id IS '阶段ID';
COMMENT ON COLUMN plan_tasks.plan_id IS '规划ID（冗余，便于查询）';
COMMENT ON COLUMN plan_tasks.name IS '任务名称';
COMMENT ON COLUMN plan_tasks.description IS '任务详细说明';
COMMENT ON COLUMN plan_tasks.due_date IS '截止日期';
COMMENT ON COLUMN plan_tasks.reminder_date IS '提醒日期';
COMMENT ON COLUMN plan_tasks.guide_url IS '详细指南链接';
COMMENT ON COLUMN plan_tasks.related_tool IS '相关工具（cost_calculator/gpa_converter）';
COMMENT ON COLUMN plan_tasks.sort_order IS '排序顺序';
COMMENT ON COLUMN plan_tasks.completed_at IS '完成时间';
COMMENT ON COLUMN plan_tasks.deleted IS '逻辑删除标记';
COMMENT ON COLUMN plan_tasks.version_id IS '乐观锁版本号';

CREATE TRIGGER update_plan_tasks_updated_at BEFORE UPDATE ON plan_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 15. 帖子表
-- ============================================

create table public.posts
(
    id            bigserial
        primary key,
    author_id     bigint not null
        constraint fk_posts_author
            references public.users
            on delete cascade,
    title         varchar(200),
    content       text   not null,
    summary       varchar(500),
    content_type  varchar(20)
        constraint posts_content_type_check
            check ((content_type)::text = ANY
                   ((ARRAY ['POST'::character varying, 'QUESTION'::character varying, 'TIMELINE'::character varying, 'VLOG'::character varying])::text[])),
    category      varchar(50),
    cover_image   varchar(500),
    media_urls    jsonb,
    view_count    integer     default 0,
    like_count    integer     default 0,
    comment_count integer     default 0,
    collect_count integer     default 0,
    share_count   integer     default 0,
    is_featured   boolean     default false,
    is_pinned     boolean     default false,
    is_hot        boolean     default false,
    status        varchar(20) default 'PUBLISHED'::character varying
        constraint posts_status_check
            check ((status)::text = ANY
                   ((ARRAY ['DRAFT'::character varying, 'PUBLISHED'::character varying, 'DELETED'::character varying])::text[])),
    allow_comment boolean     default true,
    slug          varchar(200),
    created_at    timestamp   default CURRENT_TIMESTAMP,
    updated_at    timestamp   default CURRENT_TIMESTAMP,
    published_at  timestamp,
    deleted       boolean     default false,
    version_id    integer     default 0
);

comment on table public.posts is '帖子表';

comment on column public.posts.author_id is '作者ID';

comment on column public.posts.title is '标题';

comment on column public.posts.content is '正文内容（Markdown）';

comment on column public.posts.summary is '摘要（自动提取）';

comment on column public.posts.category is '分类';

comment on column public.posts.cover_image is '封面图';

comment on column public.posts.media_urls is '图片/视频列表 ["url1","url2"]';

comment on column public.posts.view_count is '浏览量';

comment on column public.posts.like_count is '点赞数';

comment on column public.posts.comment_count is '评论数';

comment on column public.posts.collect_count is '收藏数';

comment on column public.posts.share_count is '分享数';

comment on column public.posts.is_featured is '是否精选';

comment on column public.posts.is_pinned is '是否置顶';

comment on column public.posts.is_hot is '是否热门';

comment on column public.posts.allow_comment is '允许评论';

comment on column public.posts.slug is 'URL友好标识';

comment on column public.posts.published_at is '发布时间';

comment on column public.posts.deleted is '逻辑删除标记';

comment on column public.posts.version_id is '乐观锁版本号';

alter table public.posts
    owner to root;

create index idx_posts_author_id
    on public.posts (author_id);

create index idx_posts_category
    on public.posts (category);

create index idx_posts_content_type
    on public.posts (content_type);

create index idx_posts_created_at
    on public.posts (created_at desc);

create index idx_posts_deleted
    on public.posts (deleted);

create index idx_posts_hot_featured
    on public.posts (is_hot, is_featured);

create index idx_posts_status
    on public.posts (status);

create index idx_posts_fulltext
    on public.posts using gin (to_tsvector('english'::regconfig, (title::text || ' '::text) || content));


-- ============================================
-- 16. 评论表
-- ============================================
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    parent_id BIGINT,
    root_id BIGINT,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'VISIBLE' CHECK (status IN ('VISIBLE', 'HIDDEN', 'DELETED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_deleted ON comments(deleted);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_root_id ON comments(root_id);

COMMENT ON TABLE comments IS '评论表';
COMMENT ON COLUMN comments.post_id IS '帖子ID';
COMMENT ON COLUMN comments.author_id IS '评论者ID';
COMMENT ON COLUMN comments.parent_id IS '父评论ID（回复用）';
COMMENT ON COLUMN comments.root_id IS '根评论ID（方便查询楼层）';
COMMENT ON COLUMN comments.content IS '评论内容';
COMMENT ON COLUMN comments.like_count IS '点赞数';
COMMENT ON COLUMN comments.reply_count IS '回复数';
COMMENT ON COLUMN comments.deleted IS '逻辑删除标记';
COMMENT ON COLUMN comments.version_id IS '乐观锁版本号';

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 17. 帖子收藏记录表
-- ============================================
CREATE TABLE post_collections (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    folder VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_post_collections_post_user UNIQUE (post_id, user_id),
    CONSTRAINT fk_post_collections_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_collections_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_collections_deleted ON post_collections(deleted);
CREATE INDEX idx_post_collections_user_folder ON post_collections(user_id, folder);

COMMENT ON TABLE post_collections IS '帖子收藏记录';
COMMENT ON COLUMN post_collections.post_id IS '帖子ID';
COMMENT ON COLUMN post_collections.user_id IS '用户ID';
COMMENT ON COLUMN post_collections.folder IS '收藏夹名称';
COMMENT ON COLUMN post_collections.deleted IS '逻辑删除标记';
COMMENT ON COLUMN post_collections.version_id IS '乐观锁版本号';

-- ============================================
-- 18. 帖子点赞记录表
-- ============================================
CREATE TABLE post_likes (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id),
    CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_likes_deleted ON post_likes(deleted);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

COMMENT ON TABLE post_likes IS '帖子点赞记录';
COMMENT ON COLUMN post_likes.post_id IS '帖子ID';
COMMENT ON COLUMN post_likes.user_id IS '用户ID';
COMMENT ON COLUMN post_likes.deleted IS '逻辑删除标记';
COMMENT ON COLUMN post_likes.version_id IS '乐观锁版本号';

-- ============================================
-- 19. 帖子标签关联表
-- ============================================
CREATE TABLE post_tags (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_post_tags_post_tag UNIQUE (post_id, tag_id),
    CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_tags_deleted ON post_tags(deleted);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

COMMENT ON TABLE post_tags IS '帖子标签关联表';
COMMENT ON COLUMN post_tags.deleted IS '逻辑删除标记';
COMMENT ON COLUMN post_tags.version_id IS '乐观锁版本号';

-- ============================================
-- 20. 用户提醒表
-- ============================================
CREATE TABLE reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT,
    task_id BIGINT,
    checklist_id BIGINT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    remind_time TIMESTAMP NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(100),
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_reminders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reminders_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

CREATE INDEX idx_reminders_deleted ON reminders(deleted);
CREATE INDEX idx_reminders_is_sent ON reminders(is_sent);
CREATE INDEX idx_reminders_remind_time ON reminders(remind_time);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_plan_id ON reminders(plan_id);

COMMENT ON TABLE reminders IS '用户提醒表';
COMMENT ON COLUMN reminders.user_id IS '用户ID';
COMMENT ON COLUMN reminders.plan_id IS '关联规划ID';
COMMENT ON COLUMN reminders.task_id IS '关联任务ID';
COMMENT ON COLUMN reminders.checklist_id IS '关联材料清单ID';
COMMENT ON COLUMN reminders.title IS '提醒标题';
COMMENT ON COLUMN reminders.content IS '提醒内容';
COMMENT ON COLUMN reminders.remind_time IS '提醒时间';
COMMENT ON COLUMN reminders.is_recurring IS '是否重复';
COMMENT ON COLUMN reminders.recurrence_rule IS '重复规则（daily/weekly/monthly）';
COMMENT ON COLUMN reminders.is_sent IS '是否已发送';
COMMENT ON COLUMN reminders.sent_at IS '发送时间';
COMMENT ON COLUMN reminders.deleted IS '逻辑删除标记';
COMMENT ON COLUMN reminders.version_id IS '乐观锁版本号';

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 21. 用户收藏国家表
-- ============================================
CREATE TABLE user_country_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    country_code CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_user_country_favorites_user_country UNIQUE (user_id, country_code),
    CONSTRAINT fk_user_country_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_country_favorites_country FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE
);

CREATE INDEX idx_user_country_favorites_country_code ON user_country_favorites(country_code);
CREATE INDEX idx_user_country_favorites_deleted ON user_country_favorites(deleted);

COMMENT ON TABLE user_country_favorites IS '用户收藏国家';
COMMENT ON COLUMN user_country_favorites.deleted IS '逻辑删除标记';
COMMENT ON COLUMN user_country_favorites.version_id IS '乐观锁版本号';

-- ============================================
-- 22. 用户关注关系表
-- ============================================
CREATE TABLE user_follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_user_follows_follower_followee UNIQUE (follower_id, followee_id),
    CONSTRAINT fk_user_follows_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_follows_followee FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_follows_deleted ON user_follows(deleted);
CREATE INDEX idx_user_follows_followee_id ON user_follows(followee_id);

COMMENT ON TABLE user_follows IS '用户关注关系';
COMMENT ON COLUMN user_follows.follower_id IS '关注者ID';
COMMENT ON COLUMN user_follows.followee_id IS '被关注者ID';
COMMENT ON COLUMN user_follows.deleted IS '逻辑删除标记';
COMMENT ON COLUMN user_follows.version_id IS '乐观锁版本号';

-- ============================================
-- 23. 第三方登录绑定表
-- ============================================
CREATE TABLE user_oauth_bindings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(20) CHECK (provider IN ('wechat', 'qq', 'apple', 'google', 'github')),
    provider_user_id VARCHAR(100) NOT NULL,
    provider_username VARCHAR(100),
    provider_avatar VARCHAR(500),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT uk_user_oauth_bindings_provider_user UNIQUE (provider, provider_user_id),
    CONSTRAINT fk_user_oauth_bindings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_oauth_bindings_deleted ON user_oauth_bindings(deleted);
CREATE INDEX idx_user_oauth_bindings_user_id ON user_oauth_bindings(user_id);

COMMENT ON TABLE user_oauth_bindings IS '第三方登录绑定';
COMMENT ON COLUMN user_oauth_bindings.user_id IS '用户ID';
COMMENT ON COLUMN user_oauth_bindings.provider IS '第三方平台';
COMMENT ON COLUMN user_oauth_bindings.provider_user_id IS '第三方用户ID（openid/unionid）';
COMMENT ON COLUMN user_oauth_bindings.provider_username IS '第三方用户名';
COMMENT ON COLUMN user_oauth_bindings.provider_avatar IS '第三方头像';
COMMENT ON COLUMN user_oauth_bindings.access_token IS '访问令牌（加密存储）';
COMMENT ON COLUMN user_oauth_bindings.refresh_token IS '刷新令牌';
COMMENT ON COLUMN user_oauth_bindings.expires_at IS '令牌过期时间';
COMMENT ON COLUMN user_oauth_bindings.deleted IS '逻辑删除标记';
COMMENT ON COLUMN user_oauth_bindings.version_id IS '乐观锁版本号';

CREATE TRIGGER update_user_oauth_bindings_updated_at BEFORE UPDATE ON user_oauth_bindings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 24. 用户偏好设置表
-- ============================================
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    target_countries JSONB,
    target_type VARCHAR(20) CHECK (target_type IN ('study', 'work', 'immigration', 'travel', 'undecided')),
    target_subtype VARCHAR(50),
    time_frame VARCHAR(50),
    target_departure_date DATE,
    current_stage VARCHAR(50),
    notification_enabled BOOLEAN DEFAULT TRUE,
    email_notification BOOLEAN DEFAULT TRUE,
    push_notification BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_preferences_deleted ON user_preferences(deleted);

COMMENT ON TABLE user_preferences IS '用户偏好设置';
COMMENT ON COLUMN user_preferences.user_id IS '用户ID';
COMMENT ON COLUMN user_preferences.target_countries IS '目标国家代码列表 ["US","UK","CA"]';
COMMENT ON COLUMN user_preferences.target_type IS '出国目的';
COMMENT ON COLUMN user_preferences.target_subtype IS '细分类型（bachelor/master/phd等）';
COMMENT ON COLUMN user_preferences.time_frame IS '计划时间（within_3_months/within_6_months等）';
COMMENT ON COLUMN user_preferences.target_departure_date IS '计划出发日期';
COMMENT ON COLUMN user_preferences.current_stage IS '当前所处阶段';
COMMENT ON COLUMN user_preferences.notification_enabled IS '是否接收通知';
COMMENT ON COLUMN user_preferences.email_notification IS '是否接收邮件通知';
COMMENT ON COLUMN user_preferences.push_notification IS '是否接收推送通知';
COMMENT ON COLUMN user_preferences.deleted IS '逻辑删除标记';
COMMENT ON COLUMN user_preferences.version_id IS '乐观锁版本号';

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 25. 用户详细资料表
-- ============================================
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    education_level VARCHAR(20) CHECK (education_level IN ('high_school', 'associate', 'bachelor', 'master', 'phd', 'other')),
    major VARCHAR(100),
    school VARCHAR(200),
    graduation_year SMALLINT,
    gpa DECIMAL(4, 2),
    toefl_score SMALLINT,
    ielts_score DECIMAL(3, 1),
    gre_score SMALLINT,
    gmat_score SMALLINT,
    work_years SMALLINT DEFAULT 0,
    current_company VARCHAR(200),
    current_position VARCHAR(100),
    location VARCHAR(100),
    birth_year SMALLINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_deleted ON user_profiles(deleted);

COMMENT ON TABLE user_profiles IS '用户详细资料';
COMMENT ON COLUMN user_profiles.user_id IS '用户ID';
COMMENT ON COLUMN user_profiles.education_level IS '学历';
COMMENT ON COLUMN user_profiles.major IS '专业';
COMMENT ON COLUMN user_profiles.school IS '学校';
COMMENT ON COLUMN user_profiles.graduation_year IS '毕业年份';
COMMENT ON COLUMN user_profiles.gpa IS 'GPA (如 3.75)';
COMMENT ON COLUMN user_profiles.toefl_score IS '托福分数';
COMMENT ON COLUMN user_profiles.ielts_score IS '雅思分数 (如 7.5)';
COMMENT ON COLUMN user_profiles.gre_score IS 'GRE分数';
COMMENT ON COLUMN user_profiles.gmat_score IS 'GMAT分数';
COMMENT ON COLUMN user_profiles.work_years IS '工作年限';
COMMENT ON COLUMN user_profiles.current_company IS '当前公司';
COMMENT ON COLUMN user_profiles.current_position IS '当前职位';
COMMENT ON COLUMN user_profiles.location IS '所在城市';
COMMENT ON COLUMN user_profiles.birth_year IS '出生年份';
COMMENT ON COLUMN user_profiles.deleted IS '逻辑删除标记';
COMMENT ON COLUMN user_profiles.version_id IS '乐观锁版本号';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 26. 签证预约信息表
-- ============================================
CREATE TABLE visa_slots (
    id BIGSERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    visa_type VARCHAR(50) NOT NULL,
    embassy_city VARCHAR(50) NOT NULL,
    earliest_date DATE,
    available_slots SMALLINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version_id INTEGER DEFAULT 0
);

CREATE INDEX idx_visa_slots_country_type ON visa_slots(country_code, visa_type);
CREATE INDEX idx_visa_slots_deleted ON visa_slots(deleted);
CREATE INDEX idx_visa_slots_earliest_date ON visa_slots(earliest_date);
CREATE INDEX idx_visa_slots_embassy_city ON visa_slots(embassy_city);

COMMENT ON TABLE visa_slots IS '签证预约信息';
COMMENT ON COLUMN visa_slots.country_code IS '国家代码';
COMMENT ON COLUMN visa_slots.visa_type IS '签证类型（F1/B1/H1B等）';
COMMENT ON COLUMN visa_slots.embassy_city IS '使馆城市（beijing/shanghai/guangzhou）';
COMMENT ON COLUMN visa_slots.earliest_date IS '最早可预约日期';
COMMENT ON COLUMN visa_slots.available_slots IS '可用名额数';
COMMENT ON COLUMN visa_slots.updated_at IS '更新时间';
COMMENT ON COLUMN visa_slots.deleted IS '逻辑删除标记';
COMMENT ON COLUMN visa_slots.version_id IS '乐观锁版本号';

CREATE TRIGGER update_visa_slots_updated_at BEFORE UPDATE ON visa_slots
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成提示
-- ============================================
-- 数据库表创建完成！
-- 总共创建了26张表，包含所有必要的索引、外键约束和注释
-- 
-- 下一步操作：
-- 1. 根据需要插入初始数据
-- 2. 配置应用程序连接PostgreSQL
-- 3. 运行应用程序进行测试

