import { Document, Schema, model } from 'mongoose';

export interface EtlDoc extends Document {
  createdBy: string;
  docName: string;
  docUrl: string;
}

const etlSchema = new Schema<EtlDoc>(
  {
    createdBy: { type: String, required: true },
    docName: { type: String, required: true },
    docUrl: { type: String, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Etl = model<EtlDoc>('etl', etlSchema);

export { Etl };
