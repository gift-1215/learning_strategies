export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    
    if (!DB) {
      return new Response(JSON.stringify({ error: "D1 binding 'DB' not found in environment." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 建立資料表（如果不存在）
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookId TEXT NOT NULL,
        rating INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 取得統計數據
    const { results } = await DB.prepare(`
      SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count 
      FROM ratings 
      GROUP BY bookId
    `).all();

    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { bookId, rating } = await context.request.json();

    if (!DB) {
      return new Response(JSON.stringify({ error: "D1 binding 'DB' not found" }), { status: 500 });
    }

    // 存入分數
    await DB.prepare("INSERT INTO ratings (bookId, rating) VALUES (?, ?)")
      .bind(bookId, rating)
      .run();

    // 呼叫 Get 邏輯回傳最新數據
    return onRequestGet(context);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
