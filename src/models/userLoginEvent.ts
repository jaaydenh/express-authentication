import {
  Model,
  DataTypes,
  ForeignKey,
} from 'sequelize';
  
import db from './index';
import User from './users';

export interface UserLoginEventAttributes {
  ip: string;
  session: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserLoginEvent
extends Model<UserLoginEventAttributes>
implements UserLoginEventAttributes
{
  declare id: number;
  public ip!: string;
  public session!: string;
  declare userId: ForeignKey<User['id']>;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}
UserLoginEvent.init(
  {
    ip: {
      type: new DataTypes.STRING(),
      allowNull: false,
      unique: false,
    },
    session: {
      type: new DataTypes.STRING(),
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'user_login_event',
    sequelize: db,
    defaultScope: {
      attributes: { exclude: ['UserId'] },
    },
  }
);

export default UserLoginEvent;