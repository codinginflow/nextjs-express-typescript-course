import redisClient from "../config/redisClient";

export async function destroyAllActiveSessionsForUser(userId: string) {
    let cursor = 0;
    do {
        const result = await redisClient.scan(cursor, { MATCH: `sess:${userId}*`, COUNT: 1000 });
        for (const key of result.keys) {
            await redisClient.del(key);
        }
        cursor = result.cursor;
    } while (cursor !== 0);
}