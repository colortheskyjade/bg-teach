import { getModelForClass, prop, type Ref } from '@typegoose/typegoose';
import mongoose, { Document } from 'mongoose';
import { BoardGame } from './BoardGame';

export enum ResourceType {
  RULEBOOK = 'RULEBOOK',
}

export class Resource {
  @prop({ required: true, ref: () => BoardGame })
  public boardGameId!: Ref<BoardGame>;

  @prop({ required: true, enum: ResourceType })
  public type!: ResourceType;

  @prop({ required: true })
  public content!: string;
}

export type ResourceDocument = Resource & Document;

const ResourceModel = mongoose.models.Resource || getModelForClass(Resource);

export default ResourceModel;
