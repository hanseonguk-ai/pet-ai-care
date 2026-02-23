export async function onRequestPost(context) {
  const apiKey = context.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "서버 설정 오류: API 키가 설정되지 않았습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await context.request.json();

    if (!body.contents || !Array.isArray(body.contents)) {
      return new Response(
        JSON.stringify({ error: "잘못된 요청: 'contents' 배열이 필요합니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" +
      apiKey;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const geminiData = await geminiResponse.json();

    return new Response(JSON.stringify(geminiData), {
      status: geminiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "프록시 오류: " + err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
