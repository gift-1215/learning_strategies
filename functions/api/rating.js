export async function onRequestGet(context) {
  const { DB } = context.env;
  if (!DB) return new Response(JSON.stringify({ error: "DB_NOT_BOUND" }), { status: 500, headers: { "Content-Type": "application/json" } });

  try {
    // 確保表存在
    await DB.prepare("CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY, bookId TEXT, rating INTEGER, ts DATETIME DEFAULT CURRENT_TIMESTAMP)").run();
    
    const { results } = await DB.prepare("SELECT bookId, AVG(rating) as avgRating, COUNT(*) as count FROM ratings GROUP BY bookId").all();
    return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "DB_QUERY_ERROR", msg: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost(context) {
  const { DB } = context.env;
  if (!DB) return new Response(JSON.stringify({ error: "DB_NOT_BOUND" }), { status: 500, headers: { "Content-Type": "application/json" } });

  try {
    const data = await context.request.json();
    await DB.prepare("INSERT INTO ratings (bookId, rating) VALUES (?, ?)").bind(data.bookId, Number(data.rating)).run();
    return onRequestGet(context);
  } catch (e) {
    return new Response(JSON.stringify({ error: "DB_WRITE_ERROR", msg: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
