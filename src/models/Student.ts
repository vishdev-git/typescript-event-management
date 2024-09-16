import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface StudentAttributes {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isAdmin: boolean;
  isblocked: boolean;
}

type StudentCreationAttributes = Optional<StudentAttributes, 'id'>;

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public phoneNumber!: string;
  public password!: string;
  public isAdmin!: boolean;
  public isblocked!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isblocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students',
});

export default Student;

// Interfaces
export interface SignupRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  retypePassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}

export interface LoginResponse {
  message: string;
  token: string;
  id: number;
  email: string;
  isAdmin?: boolean;
  isblocked?: boolean; // Updated casing for 'isBlocked'
}
