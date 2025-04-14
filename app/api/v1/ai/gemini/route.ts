import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/config"
import { memoryCache } from "@/lib/cache"

// Cache TTL in seconds
const CACHE_TTL = 3600 // 1 hour

export async function GET(request: Request) {
  if (siteConfig.maintenance.enabled) {
    return new NextResponse(
      JSON.stringify(
        {
          status: siteConfig.maintenance.apiResponse.status,
          creator: siteConfig.api.creator,
          message: siteConfig.maintenance.apiResponse.message,
        },
        null,
        2
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    )
  }

  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get("prompt") || "Hi, act like Gemini AI"

  try {
    const cacheKey = `gemini-response-${prompt}`
    const cachedResponse = memoryCache.get(cacheKey)

    if (cachedResponse) {
      return new NextResponse(
        JSON.stringify(
          {
            status: true,
            creator: siteConfig.api.creator,
            result: cachedResponse,
            cached: true,
            version: "v1",
          },
          null,
          2
        ),
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=1800, s-maxage=3600",
          },
        }
      )
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Kamu adalah GeminiAI, asisten yang dibuat oleh Danz-dev. Kamu adalah asisten sekaligus teman chatting yang baik dan ramah.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    const openaiData = await openaiRes.json()
    const responseText = openaiData.choices?.[0]?.message?.content?.trim() || "Eh, halo! Ada yang bisa aku bantu?"

    memoryCache.set(cacheKey, responseText, CACHE_TTL)

    return new NextResponse(
      JSON.stringify(
        {
          status: true,
          creator: siteConfig.api.creator,
          result: responseText,
          version: "v1",
        },
        null,
        2
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=1800, s-maxage=3600",
        },
      }
    )
  } catch (error) {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: error instanceof Error ? error.message : "An error occurred",
          version: "v1",
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    )
  }
}
