import mongoose from "mongoose";

import { BaseSchema } from "./base";
import {
  type Integration,
  INTEGRATION_CATEGORIES,
} from "~/lib/types/integrations";

type IntegrationWithDocument = Integration & mongoose.Document;

const IntegrationSchema = new BaseSchema<IntegrationWithDocument>({
  image: {
    type: String,
    required: [true, "Please provide an image for this integration."],
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this integration."],
  },
  category: {
    type: String,
    enum: INTEGRATION_CATEGORIES,
    required: [true, "Please provide a category for this integration."],
  },
  description: {
    type: String,
    required: [true, "Please provide a description for this integration."],
  },
});

export default (mongoose.models
  .Integration as mongoose.Model<IntegrationWithDocument>) ||
  mongoose.model("Integration", IntegrationSchema);
