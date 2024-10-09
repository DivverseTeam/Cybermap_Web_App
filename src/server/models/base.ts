import { Schema, type SchemaDefinition, type Document } from "mongoose";

export class BaseSchema<T extends Document> extends Schema<T> {
	constructor(schemaDefinition: SchemaDefinition<T>) {
		super(schemaDefinition, { timestamps: true });

		this.set("toJSON", {
			virtuals: true,
			transform: (_doc, converted) => {
				// Remove sensitive fields (like password) if they exist
				if (converted.password) delete converted.password;
				return converted;
			},
		});
	}
}
