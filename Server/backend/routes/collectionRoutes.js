const express = require("express");
const router = express.Router();
const pool = require("../db");

// Lấy danh sách bộ sưu tập cùng số lượng sản phẩm
router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            SELECT c.id, c.name, c.description,
                (SELECT COUNT(*) FROM products p WHERE p.collection_id = c.id) AS product_count
            FROM collections c
        `;

        const [results] = await connection.execute(sql);
        res.json(results);
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Thêm bộ sưu tập mới
router.post("/", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Tên bộ sưu tập không được để trống" });

        const sql = "INSERT INTO collections (name, description) VALUES (?, ?)";
        const [result] = await connection.execute(sql, [name, description]);

        res.json({ id: result.insertId, name, description });
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Cập nhật bộ sưu tập
router.put("/:id", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Tên bộ sưu tập không được để trống" });

        const sql = "UPDATE collections SET name = ?, description = ? WHERE id = ?";
        await connection.execute(sql, [name, description, id]);

        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Xóa bộ sưu tập
router.delete("/:id", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { id } = req.params;

        const sql = "DELETE FROM collections WHERE id = ?";
        await connection.execute(sql, [id]);

        res.json({ message: "Xóa thành công" });
    } catch (err) {
        console.error("Lỗi truy vấn CSDL:", err);
        return res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;