import { getModelForClass, prop } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
