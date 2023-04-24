import {
  Model,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize';
import db from './index';
import User from './users';

export class UserProfile
  extends Model<InferAttributes<UserProfile>,
  InferCreationAttributes<UserProfile>>
{
  public id!: string;
  public name!: string;
  public displayName!: string;
  declare userId: ForeignKey<User['id']>;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}
UserProfile.init(
{
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(),
    allowNull: false,
    unique: false,
  },
  displayName: {
    type: new DataTypes.STRING(),
    allowNull: false,
    unique: false,
  },
},
{
  tableName: 'user_profiles',
  sequelize: db,
  defaultScope: {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'UserId'] },
  },
}
);

export default UserProfile;