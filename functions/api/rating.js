export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  if (!DB) {
    return new Response(JSON.stringify({ error: "DB_BINDING_MISSING" }), { status: 500 });
  }

  // 確保資料表存在
  try {
    await DB.prepare("CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY, bookId TEXT, rating INTEGER, ts DATETIME DEFAULT CURRENT_TIMESTAMP)").run();
  } catch (e) {
    return new Response(JSON.stringify({ error: "INIT_TABLE_FAILED", msg: e.message }), { status: 500 });
  }

  if (request.method === "POST") {
    try {
      const { bookId, rating } = await request.json();
      await DB.prepare("INSERT INTO ratings (bookId, rating) VALUES (?, ?)").bind(bookId, rating).run();
    } catch (e) {
      return new Response(JSON.stringify({ error: "POST_FAILED", msg: e.message }), { status: 500 });
    }
  }

  // GET 與 POST 之後都回傳統計
  try {
    const { results } = await DB.prepare("SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count FROM ratings GROUP BY bookId").all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "GET_STATS_FAILED", msg: e.message }), { status: 500 });
  }
}
