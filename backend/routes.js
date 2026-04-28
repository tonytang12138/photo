const express = require('express');
const router = express.Router();
const db = require('./db');
const middleware = require('./middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const uploadDir = middleware.ensureUploadDirExists();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
    fileFilter: (req, file, cb) => {
        if (!middleware.validateFileType(file)) {
            return cb(new Error('不支持的文件类型'));
        }
        cb(null, true);
    }
});

// 管理员登录
router.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '请提供用户名和密码' });
    }

    db.get("SELECT * FROM admins WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }

        if (!user || !middleware.verifyPassword(password, user.password)) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        const token = middleware.generateToken(user);
        
        // 记录登录活动
        db.run(
            "INSERT INTO activity_logs (action, admin_id, details) VALUES (?, ?, ?)",
            ["登录", user.id, `管理员 ${user.username} 登录系统`],
            (err) => {
                if (err) console.error('记录登录活动失败:', err.message);
            }
        );

        res.json({
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});

// 检查登录状态
router.get('/api/auth/check', middleware.authenticateToken, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
});

// 管理员登出
router.post('/api/auth/logout', middleware.authenticateToken, (req, res) => {
    // 记录登出活动
    db.run(
        "INSERT INTO activity_logs (action, admin_id, details) VALUES (?, ?, ?)",
        ["登出", req.user.id, `管理员 ${req.user.username} 登出系统`],
        (err) => {
            if (err) console.error('记录登出活动失败:', err.message);
        }
    );

    res.json({ message: '登出成功' });
});

// 获取管理员信息
router.get('/api/admins/profile', middleware.authenticateToken, (req, res) => {
    db.get("SELECT id, username, email, created_at FROM admins WHERE id = ?", [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        res.json(user);
    });
});

// 更新管理员信息
router.put('/api/admins/profile', middleware.authenticateToken, (req, res) => {
    const { email } = req.body;

    db.run(
        "UPDATE admins SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [email, req.user.id],
        (err) => {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }

            // 记录更新活动
            db.run(
                "INSERT INTO activity_logs (action, admin_id, details) VALUES (?, ?, ?)",
                ["更新个人信息", req.user.id, `管理员 ${req.user.username} 更新了个人信息`],
                (err) => {
                    if (err) console.error('记录更新活动失败:', err.message);
                }
            );

            res.json({ message: '个人信息更新成功' });
        }
    );
});

// 修改密码
router.put('/api/admins/password', middleware.authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    db.get("SELECT * FROM admins WHERE id = ?", [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }

        if (!middleware.verifyPassword(currentPassword, user.password)) {
            return res.status(401).json({ message: '当前密码错误' });
        }

        const hashedPassword = middleware.hashPassword(newPassword);

        db.run(
            "UPDATE admins SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [hashedPassword, req.user.id],
            (err) => {
                if (err) {
                    return res.status(500).json({ message: '服务器错误' });
                }

                // 记录密码更新活动
                db.run(
                    "INSERT INTO activity_logs (action, admin_id, details) VALUES (?, ?, ?)",
                    ["修改密码", req.user.id, `管理员 ${req.user.username} 修改了密码`],
                    (err) => {
                        if (err) console.error('记录密码更新活动失败:', err.message);
                    }
                );

                res.json({ message: '密码更新成功' });
            }
        );
    });
});

// 获取所有图片
router.get('/api/images', middleware.authenticateToken, (req, res) => {
    const { category, search, status } = req.query;
    let query = "SELECT * FROM images WHERE 1=1";
    const params = [];

    if (category && category !== 'all') {
        query += " AND category = ?";
        params.push(category);
    }

    if (status && status !== 'all') {
        query += " AND status = ?";
        params.push(status);
    }

    if (search) {
        query += " AND (title LIKE ? OR description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY uploaded_at DESC";

    db.all(query, params, (err, images) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        res.json(images);
    });
});

// 获取单个图片详情
router.get('/api/images/:id', middleware.authenticateToken, (req, res) => {
    db.get("SELECT * FROM images WHERE id = ?", [req.params.id], (err, image) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        if (!image) {
            return res.status(404).json({ message: '图片未找到' });
        }
        res.json(image);
    });
});

// 上传新图片
router.post('/api/images', middleware.authenticateToken, upload.single('image'), (req, res) => {
    const { title, description, category, status } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    db.run(
        "INSERT INTO images (title, description, category, image_path, status, admin_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, category, imagePath, status || 'published', req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }

            const imageId = this.lastID;

            // 记录上传活动
            db.run(
                "INSERT INTO activity_logs (action, image_id, admin_id, details) VALUES (?, ?, ?, ?)",
                ["上传图片", imageId, req.user.id, `上传了图片: ${title}`],
                (err) => {
                    if (err) console.error('记录上传活动失败:', err.message);
                }
            );

            res.status(201).json({
                id: imageId,
                title,
                description,
                category,
                image_path: imagePath,
                status: status || 'published',
                uploaded_at: new Date().toISOString()
            });
        }
    );
});

// 更新图片信息
router.put('/api/images/:id', middleware.authenticateToken, (req, res) => {
    const { title, description, category, status } = req.body;

    db.run(
        "UPDATE images SET title = ?, description = ?, category = ?, status = ? WHERE id = ?",
        [title, description, category, status, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: '图片未找到' });
            }

            // 记录更新活动
            db.run(
                "INSERT INTO activity_logs (action, image_id, admin_id, details) VALUES (?, ?, ?, ?)",
                ["更新图片", req.params.id, req.user.id, `更新了图片信息: ${title}`],
                (err) => {
                    if (err) console.error('记录更新活动失败:', err.message);
                }
            );

            res.json({ message: '图片信息更新成功' });
        }
    );
});

// 删除图片
router.delete('/api/images/:id', middleware.authenticateToken, (req, res) => {
    // 先获取图片信息，以便删除文件和记录日志
    db.get("SELECT * FROM images WHERE id = ?", [req.params.id], (err, image) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        if (!image) {
            return res.status(404).json({ message: '图片未找到' });
        }

        // 删除图片文件
        const filePath = path.join(uploadDir, path.basename(image.image_path));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 删除数据库记录
        db.run("DELETE FROM images WHERE id = ?", [req.params.id], function(err) {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }

            // 记录删除活动
            db.run(
                "INSERT INTO activity_logs (action, image_id, admin_id, details) VALUES (?, ?, ?, ?)",
                ["删除图片", req.params.id, req.user.id, `删除了图片: ${image.title}`],
                (err) => {
                    if (err) console.error('记录删除活动失败:', err.message);
                }
            );

            res.json({ message: '图片删除成功' });
        });
    });
});

// 获取所有分类
router.get('/api/images/categories', middleware.authenticateToken, (req, res) => {
    db.all("SELECT DISTINCT category FROM images", [], (err, categories) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        res.json(categories.map(c => c.category));
    });
});

// 获取活动日志
router.get('/api/logs', middleware.authenticateToken, (req, res) => {
    const { limit = 50 } = req.query;

    db.all(
        `SELECT al.*, i.title as image_title, a.username as admin_username 
         FROM activity_logs al
         LEFT JOIN images i ON al.image_id = i.id
         LEFT JOIN admins a ON al.admin_id = a.id
         ORDER BY al.created_at DESC
         LIMIT ?`,
        [limit],
        (err, logs) => {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }
            res.json(logs);
        }
    );
});

// 获取统计数据
router.get('/api/stats', middleware.authenticateToken, (req, res) => {
    const stats = {
        totalImages: 0,
        landscapeCount: 0,
        cityscapeCount: 0,
        natureCount: 0
    };

    // 获取图片总数
    db.get("SELECT COUNT(*) as count FROM images", [], (err, row) => {
        if (err) {
            return res.status(500).json({ message: '服务器错误' });
        }
        stats.totalImages = row.count;

        // 获取风景图片数量
        db.get("SELECT COUNT(*) as count FROM images WHERE category = 'landscape'", [], (err, row) => {
            if (err) {
                return res.status(500).json({ message: '服务器错误' });
            }
            stats.landscapeCount = row.count;

            // 获取城市图片数量
            db.get("SELECT COUNT(*) as count FROM images WHERE category = 'cityscape'", [], (err, row) => {
                if (err) {
                    return res.status(500).json({ message: '服务器错误' });
                }
                stats.cityscapeCount = row.count;

                // 获取自然图片数量
                db.get("SELECT COUNT(*) as count FROM images WHERE category = 'nature'", [], (err, row) => {
                    if (err) {
                        return res.status(500).json({ message: '服务器错误' });
                    }
                    stats.natureCount = row.count;

                    res.json(stats);
                });
            });
        });
    });
});

module.exports = router;