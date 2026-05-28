export async function onRequestGet(context) {
  const { DB } = context.env;
  
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
  const stats = await DB.prepare(`
    SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count 
    FROM ratings 
    GROUP BY bookId
  `).all();

  return new Response(JSON.stringify(stats.results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { DB } = context.env;
  const { bookId, rating } = await context.request.json();

  if (!bookId || !rating) {
    return new Response("Missing data", { status: 400 });
  }

  // 存入分數
  await DB.prepare("INSERT INTO ratings (bookId, rating) VALUES (?, ?)")
    .bind(bookId, rating)
    .run();

  // 回傳最新的統計數據
  return onRequestGet(context);
}
