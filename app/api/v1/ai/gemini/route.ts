import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/config"
import { memoryCache } from "@/lib/cache"
import axios from "axios"

// Cache TTL in seconds
const CACHE_TTL = 3600 // 1 hour

class GeminiAPI {
  constructor() {
    this.encKey = [
      "QUl6YVN5RGtha2QtMWNiR3FlU1Y2eHJ3WTk4Q0o4SVF5LUpqeUgw",
      "QUl6YVN5Q2dTVmc4Mms1aUt2Tng2LTNEUmFCSE5Ham5CbGNxaTJZ",
      "QUl6YVN5Q1dlZUVPVHlqT2Vwc0kyTjg0SDRDMUd4bDlwWk45X3Zr",
      "QUl6YVN5RGQzM0VBejJXR3BqdkM4R0xJV09sNFJFRXRQSWJCVjBz",
      "QUl6YVN5QW92M2ZZV0hOejNGaWpQaVNFRG81MnJrTFlBWWsxaEFz",
      "QUl6YVN5Q2JJVXhPZUVmWl90ajhEbk1BYWhmNG9pNXBuTVh6OXRr",
      "QUl6YVN5QnlSSjk5eEhkV2ozWFl6YmdZQUFkbTRDUUF6NzBUYXBj"
    ]
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/"
    this.headers = {
      "content-type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
    }
  }

  async chat({ model = "gemini-1.5-flash", prompt }) {
    if (!prompt) throw new Error("Prompt is required")
    const ranKey = this.encKey[Math.floor(Math.random() * this.encKey.length)]
    const decKey = Buffer.from(ranKey, "base64").toString("utf-8")
    const url = `${this.baseUrl}${model}:generateContent?key=${decKey}`
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }

    const response = await axios.post(url, body, {
      headers: this.headers
    })

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    return result
  }
}

export async function GET(request: Request) {
  if (siteConfig.maintenance.enabled) {
    return new NextResponse(
      JSON.stringify(
        {
          status: siteConfig.maintenance.apiResponse.status,
          creator: siteConfig.api.creator,
          message: siteConfig.maintenance.apiResponse.message
        },
        null,
        2
      ),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    )
  }

  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get("prompt")
  const cacheKey = `gemini-${prompt}`

  if (!prompt) {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: "Prompt is required",
          version: "v1"
        },
        null,
        2
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    )
  }

  try {
    const cachedResponse = memoryCache.get(cacheKey)
    if (cachedResponse) {
      return new NextResponse(
        JSON.stringify(
          {
            status: true,
            creator: siteConfig.api.creator,
            result: cachedResponse,
            cached: true,
            version: "v1"
          },
          null,
          2
        ),
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=1800, s-maxage=3600"
          }
        }
      )
    }

    const gemini = new GeminiAPI()
    const result = await gemini.chat({ prompt })

    memoryCache.set(cacheKey, result, CACHE_TTL)

    return new NextResponse(
      JSON.stringify(
        {
          status: true,
          creator: siteConfig.api.creator,
          result,
          version: "v1"
        },
        null,
        2
      ),
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=1800, s-maxage=3600"
        }
      }
    )
  } catch (error) {
    return new NextResponse(
      JSON.stringify(
        {
          status: false,
          creator: siteConfig.api.creator,
          error: error instanceof Error ? error.message : "An error occurred",
          version: "v1"
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    )
  }
}
