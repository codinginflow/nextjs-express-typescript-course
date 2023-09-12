import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params: { slug } }: { params: { slug: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");

        if (!secret || secret !== process.env.POST_REVALIDATION_KEY) {
            return NextResponse.json(
                { error: "Invalid revalidation key" },
                { status: 401 }
            )
        }

        console.log("Revalidating tag: " + slug);

        revalidateTag(slug);

        return NextResponse.json(
            { message: "Revalidation successful" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Error revalidating" },
            { status: 500 }
        )
    }
}
