import mongoose from "mongoose";

export async function destroyAllActiveSessionsForUser(userId: string) {
    const regexp = new RegExp("^" + userId);
    mongoose.connection.db.collection("sessions").deleteMany({ _id: regexp });
}