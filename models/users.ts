import {
  Model,
  DataTypes,
  UUIDV4,
  HasOneCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize';
import db from './index';
import UserProfile from './userProfile';

// interface UserAttributes {
//   id: string;
//   email: string;
//   password: string;
// }

export class User
  extends Model<InferAttributes<User>,
  InferCreationAttributes<User>>
{
  public id!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  declare createUserProfile: HasOneCreateAssociationMixin<UserProfile>;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(),
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'users',
    sequelize: db,
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    },
    scopes: {
        withPassword: {
            attributes: undefined,
        }
    }
  }
);

export default User;