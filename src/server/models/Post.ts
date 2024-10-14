import mongoose from "mongoose";

export interface Post extends mongoose.Document {
	title: string;
	content: string;
}

const PostSchema = new mongoose.Schema<Post>({
	title: {
		type: String,
		required: [true, "Please provide a title for this post."],
		maxlength: [60, "Title cannot be more than 60 characters"],
	},
	content: {
		type: String,
		required: [true, "Please provide the content for this post"],
	},
});

export default (mongoose.models.Post as mongoose.Model<Post>) ||
	mongoose.model("Post", PostSchema);
