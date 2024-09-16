import { sequelize } from '../config/database';
import Student from './Student';
import Event from './Event';
import UserEvent from './UserEvent';

// Define associations
Student.belongsToMany(Event, { through: UserEvent, foreignKey: 'userId', as: 'Events' });
Event.belongsToMany(Student, { through: UserEvent, foreignKey: 'eventId', as: 'Students' });

// Define associations for UserEvent
UserEvent.belongsTo(Student, { foreignKey: 'userId', as: 'Student' });
UserEvent.belongsTo(Event, { foreignKey: 'eventId', as: 'Event' });

// Sync models and create tables if they do not exist
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

export { sequelize, Student, Event, UserEvent };