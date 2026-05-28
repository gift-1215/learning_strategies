async function initTable(DB) {
  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      ts DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return new Response(JSON.stringify({ error: "DB_NOT_BOUND" }), { status: 500 });

  try {
    await initTable(DB);
    const { results } = await DB.prepare("SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count FROM ratings GROUP BY bookId").all();
    return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "DB_QUERY_ERROR", msg: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { DB } = context.env;
  if (!DB) return new Response(JSON.stringify({ error: "DB_NOT_BOUND" }), { status: 500 });

  try {
    await initTable(DB); // 確保在寫入前表已經存在
    const data = await context.request.json();
    await DB.prepare("INSERT INTO ratings (bookId, rating) VALUES (?, ?)").bind(data.bookId, Number(data.rating)).run();
    
    // 寫入後重新讀取最新統計
    const { results } = await DB.prepare("SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count FROM ratings GROUP BY bookId").all();
    return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "DB_WRITE_ERROR", msg: e.message }), { status: 500 });
  }
}
