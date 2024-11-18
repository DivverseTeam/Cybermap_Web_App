import { type Document, Schema, type SchemaDefinition } from "mongoose";

export class BaseSchema<T extends Document> extends Schema<T> {
  constructor(schemaDefinition: SchemaDefinition<T>) {
    super(schemaDefinition, { timestamps: true });

    this.set("toJSON", {
      virtuals: true,
    });
  }
}
