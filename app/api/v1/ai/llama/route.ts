import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/config"
import { memoryCache } from "@/lib/cache"

// Cache TTL in seconds
const CACHE_TTL = 3600 // 1 hour

export async function GET(request: Request) {
  // Check if maintenance mode is enabled
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
        status: 503, // Service Unavailable
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    )
  }

  // Get query parameters
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "daily"
  const query = searchParams.get("query") || "Halo!"

  try {
    // Create a cache key
    const cacheKey = `analytics-stats-${period}-${query}`

    // Try to get from cache first
    const cachedResponse = memoryCache.get(cacheKey)
    if (cachedResponse) {
      return new NextResponse(
        JSON.stringify(
          {
            status: true,
            creator: siteConfig.api.creator,
            result: cachedResponse,
            cached: true,
            version: "v1", // or "v2" depending on the file location
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

    // Implement your API logic here
    const response = await fetch(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(query)}`)
    const data = await response.json()
    const result = data.result || "Tidak ada respon."

    // Cache the result
    memoryCache.set(cacheKey, result, CACHE_TTL)

    // Return the response
    return new NextResponse(
      JSON.stringify(
        {
          status: true,
          creator: siteConfig.api.creator,
          result,
          version: "v1", // or "v2" depending on the file location
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
          version: "v1", // or "v2" depending on the file location
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
