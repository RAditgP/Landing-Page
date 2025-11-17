export async function GET(request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const message = url.searchParams.get("message");
  const code = url.searchParams.get("code");

  return Response.json(
    {
      success: false,
      error: error || "No error param received",
      message: message || "No message provided",
      code: code || null
    },
    { status: 400 }
  );
}

