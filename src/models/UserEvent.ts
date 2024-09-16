import { Model, DataTypes, BelongsToGetAssociationMixin, Association } from 'sequelize';
import { sequelize } from '../config/database';
import Student from './Student';
import Event from './Event';

class UserEvent extends Model {
  public userId!: number;
  public eventId!: number;

  // Associations
  public Student?: Student;
  public Event?: Event;

  public getStudent!: BelongsToGetAssociationMixin<Student>;
  public getEvent!: BelongsToGetAssociationMixin<Event>;

  public static associations: {
    Student: Association<UserEvent, Student>;
    Event: Association<UserEvent, Event>;
  };
}

UserEvent.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'UserEvent',
  tableName: 'user_events',
  timestamps: false,
});

export default UserEvent;