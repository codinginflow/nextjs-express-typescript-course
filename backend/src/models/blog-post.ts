import { InferSchemaType, model, Schema } from "mongoose";

const blogPostSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    body: { type: String, required: true },
    featuredImageUrl: {type: String, required: true},
}, { timestamps: true });

type BlogPost = InferSchemaType<typeof blogPostSchema>;

export default model<BlogPost>("BlogPost", blogPostSchema);